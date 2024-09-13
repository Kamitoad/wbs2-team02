import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Subject} from 'rxjs';
import {isPlatformBrowser} from "@angular/common";
import {io, Socket} from "socket.io-client";


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
  private socket!: Socket;
  moveSubject = new Subject<any>();
  winnerSubject = new Subject<any>();
  joinedGameSubject = new Subject<any>();
  joinedGame$ = this.joinedGameSubject.asObservable();

  // moveSubject = new Subject<{ row: number, col: number, playerLeft: 'X' | 'O' }>();
  // winnerSubject = new Subject<{ gameId: number; winner: string }>();
  gameDataSubject = new Subject<any>(); // Fügt einen Subject für Game-Daten hinzu
  currentPlayer: number | undefined = undefined;
  assignedPlayer: Player | undefined = undefined;

  constructor(
    //@ts-ignore
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io('http://localhost:3000/ws-user-game'); // WebSocket-Verbindung zum NestJS-Server
      this.setupSocketListeners();
    }
  }

  setupSocketListeners() {

    // Listen for moves
    this.socket.on('joinedGame', (data: any) => {
      this.joinedGameSubject.next(data);
    });

    // Listen for winner updates
    this.socket.on('winner', (data: any) => {
      this.winnerSubject.next(data);
    });

    this.socket.on('gameState', (gameData: any) => {
      console.log(`Game state updated:`, gameData);
      if (gameData.players) {
        console.log('Players:', gameData.players);  // Prüfe, ob die Spielerinformationen korrekt sind
      }
      // Verarbeite die neue Spielfelddaten
      this.moveSubject.next(gameData);
      this.gameDataSubject.next(gameData); // Game-Daten für andere Komponenten bereitstellen
      console.log(this.gameDataSubject)
    });
    /*
    if (this.socket) {
      // Empfang von Zügen vom Server
      this.socket.on('gameState', (gameData: any) => {
        console.log(`Game state updated:`, gameData);
        if (gameData.players) {
          console.log('Players:', gameData.players);  // Prüfe, ob die Spielerinformationen korrekt sind
        }
        // Verarbeite die neue Spielfelddaten
        this.moveSubject.next(gameData);
        this.gameDataSubject.next(gameData); // Game-Daten für andere Komponenten bereitstellen
      });

      // Gewinnerinformationen vom Server
      this.socket.on('winner', (data: { gameId: number; winner: string }) => {
        console.log(`Winner for game ${data.gameId}: ${data.winner}`);
        this.winnerSubject.next(data);
      });

      // Empfang eines Fehlers
      this.socket.on('error', (error: { message: string }) => {
        console.error('WebSocket error:', error.message);
      });
    } */
  }

  move(gameId: number, squareId: number, symbol: string) {
    this.socket.emit('makeMove', {gameId, squareId, symbol});
  }

  // Methode zum Senden eines Zugs
  // Emit move
  /*
  emitMove(gameId: number, row: number, col: number, userId: number): void {
    console.log('CurrentPlayer:' + this.currentPlayer);
    console.log('AssignedPlayer:' + this.assignedPlayer);
    this.socket.emit('makeMove', {gameId, row, col, userId});
  }
*/
  emitMove(gameId: number, row: number, col: number, playerId: number) {
    this.socket.emit('move', {gameId, userId: playerId, move: {x: row, y: col}});
  }

  // Methode zum Beitreten eines Spiels
  joinGame(gameId: number, userId: number): void {
    this.socket.emit('joinGame', { gameId, userId });
  }

  listenToGameData() {
    return this.gameDataSubject.asObservable(); // Abonniere Game-Daten
  }
}

// Vorherige Methoden auskommentiert
/*
  // Methode zum Erstellen eines neuen Spiels
  createGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {}).pipe(
      tap((response: any) => {
        this.gameId = response.gameId; // Speichere die gameId beim Erstellen des Spiels
      })
    );
  }
*/

// Mögliche spätere Methoden für das Spiel
/*
emitMove(gameId: number, move: { playerId: number, x: number, y: number }) {
  this.socket.emit('makeMove', { gameId, move });
}

listenToMoves() {
  this.socket.on('moveMade', (move: { playerId: number, x: number, y: number }) => {
    console.log('Move made:', move);
  });
}

emitLeaveGame(gameId: number, userId: number) {
  this.socket.emit('leaveGame', { gameId, userId });
}

listenToOpponentLeave() {
  this.socket.on('opponentLeft', (data: any) => {
    console.log('Opponent left the game:', data);
  });
}
*/

/*
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: any;

  private baseUrl: string;  //Needed to test project rather in Angular or Nest.js Server

  private apiUrl = 'http://localhost:3000/api/game';
  //private socket = io('http://localhost:3000'); // WebSocket-Verbindung
  private currentPlayer: 'X' | 'O' = 'X'; // Der Spieler, der aktuell am Zug ist
  gameId!: number; // Speichere die gameId hier für spätere Zugriffe

  // Subject für WebSocket-Zug-Updates
  moveSubject = new Subject<{ row: number, col: number, playerLeft: 'X' | 'O' }>();

  constructor(
    private http: HttpClient,
    //@ts-ignore
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://localhost:3000';

    //To make sure Angular can be build properly with sockets to test with Nest.js
    if (isPlatformBrowser(this.platformId)) {
      this.socket = require('socket.io-client')('http://localhost:3000/ws-user-game');
    }
    // this.setupSocketListeners();
  }

// Beispiel: Nutzer- und Spielinformationen aus localStorage oder einer ähnlichen Quelle holen
  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  getOpponentId(): string {
    return localStorage.getItem('opponentId') || '';
  }

  getGameId(): number {
    return parseInt(localStorage.getItem('gameId') || '0', 10);
  }
*/
/*
// Methode zum Erstellen eines neuen Spiels
createGame(): Observable<any> {
  return this.http.post(`${this.apiUrl}`, {}).pipe(
    tap((response: any) => {
      this.gameId = response.gameId; // Speichere die gameId beim Erstellen des Spiels
    })
  );
}
*/
/*
  // Methode zum Abrufen des Spielstatus
  getGameState(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${gameId}`);
  }
*/

// Methode zum Ausführen eines Zuges
/*
  makeMove(row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.gameId}/move`, {row, col, playerLeft: this.currentPlayer});
  }
*/
// WebSocket-Verbindung einrichten
// Debuggen der WebSocket-Verbindung

/*
private setupSocketListeners() {
  this.socket.on('move', (data: { row: number, col: number, playerLeft: 'X' | 'O' }) => {
    console.log(`Move received from server:`, data);
    this.moveSubject.next(data);
  });

  this.socket.on('winner', (data: any) => {
    console.log(`Winner detected: ${data.winner}`);
  });
}
*/
// Debuggen von Spielzügen
/*
emitMove(row: number, col: number) {
  console.log(`Emitting move: Row: ${row}, Col: ${col}, Player: ${this.currentPlayer}`);
  this.socket.emit('move', {gameId: this.gameId, row, col, playerLeft: this.currentPlayer});
}
}
*/

// WebSocket-Verbindung aufbauen
/*
setupWebSocketConnection() {
  if (this.socket) {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Handle errors
    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }
}

 */
/*
  setupSocketListeners() {
    if (this.socket) {
      this.socket.on('move', (data: { row: number, col: number, playerLeft: 'X' | 'O' }) => {
        console.log(`Move received from server:`, data);
        this.moveSubject.next(data);  // Aktualisiere den Spielstatus basierend auf den Daten vom Server
      });

      this.socket.on('winner', (data: { winner: string }) => {
        console.log(`Winner: ${data.winner}`);
      });
    }
  }
  */
/*
  emitMove(row: number, col: number) {
    console.log(`Sending move: Row: ${row}, Col: ${col}, Player: ${this.currentPlayer}`);
    this.socket.emit('move', {
      gameId: this.getGameId(),  // Hole die GameID
      row: row,
      col: col,
      playerLeft: this.currentPlayer
    });
  }
}
 */
