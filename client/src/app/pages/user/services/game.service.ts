import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {isPlatformBrowser} from "@angular/common";
import {io, Socket} from "socket.io-client";
import {HttpClient} from "@angular/common/http";

export interface Player {
  id: number;
  username: string;
  symbol: 'X' | 'O';
  isTurn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = '/api/game';

  private socket!: Socket;
  private gameSocket!: Socket;

  moveSubject = new Subject<any>();
  winnerSubject = new Subject<any>();
  joinedGameSubject = new Subject<any>();
  joinedGame$ = this.joinedGameSubject.asObservable();
  gameDataSubject = new Subject<any>(); // Fügt einen Subject für Game-Daten hinzu
  gameData$ = this.joinedGameSubject.asObservable();

  currentPlayer: number | undefined = undefined;
  assignedPlayer: Player | undefined = undefined;

  constructor(
    //@ts-ignore
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      console.log("this.plattformId")
      this.socket = io('http://localhost:3000/ws-user-game');// WebSocket-Verbindung zum NestJS-Server
      this.gameSocket = require('socket.io-client')('http://localhost:3000/ws-admin-gamedata');
      this.setupSocketListeners();
    }
  }

  ngOnInit() {
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    // Listen for moves
    this.socket.on('joinedGame', (data: any) => {
      console.log('Joined game:', data);
      this.gameDataSubject.next(data); // Game-Daten für andere Komponenten bereitstellen
      this.joinedGameSubject.next(data);
    });

    // Listen for winner updates
    this.gameSocket.on('winner', (gameId: number, winnerId: number) => {
      console.log("winner winnersocket")

      console.log('winner:', winnerId);
      console.log('gameId:', gameId);

      this.winnerSubject.next(winnerId);
      this.openEndGameModal();
    });

    // Listen for loser updates
    this.gameSocket.on('loser', (gameId: number, loserId: number) => {
      console.log('loserId:', loserId);
      console.log('gameId:', gameId);
      this.winnerSubject.next(loserId);
      this.openEndGameModal();
    });

    this.socket.on('gameState', (gameData: any) => {
      console.log(`Game state updated:`, gameData);
      if (gameData.players) {
        console.log('Players:', gameData.players);  // Prüfe, ob die Spielerinformationen korrekt sind
      }
      // Verarbeite die neuen Spielfelddaten
      this.moveSubject.next(gameData);
      this.gameDataSubject.next(gameData); // Game-Daten für andere Komponenten bereitstellen
    });
  }

  emitMove(gameId: number, row: number, col: number, playerId: number) {
    this.socket.emit('move', {gameId, userId: playerId, move: {x: row, y: col}});
  }

  /*
  resign(gameId: number, userId: number): void {
    this.socket.emit('resign', {gameId, userId});
  }
*/

  // Methode zum Beitreten eines Spiels
  joinGame(gameId: number, userId: number): void {
    this.socket.emit('joinGame', {gameId, userId});
  }

  listenToGameData() {
    return this.gameDataSubject.asObservable(); // Abonniere Game-Daten
  }

  getGame(gameId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${gameId}`);
  }

  initializeBoard(gameId: number): void {
    this.getGame(gameId).subscribe(game => {
      localStorage.setItem('gameData', JSON.stringify(game));
      this.gameDataSubject.next(game);
    });
  }

  openEndGameModal() {
    console.log('Das Spiel ist vorbei. Öffne das Angular-Modal.');
  }
}
