import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGameStateSubject = new BehaviorSubject<any | null>(null);
  currentGameState$ = this.currentGameStateSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private gameStatusSubject = new BehaviorSubject<string | null>(null);
  gameStatus$ = this.gameStatusSubject.asObservable();

  private socket: any;
  private baseUrl: string;  // Base URL for API requests

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://localhost:3000';

    if (isPlatformBrowser(this.platformId)) {
      this.socket = require('socket.io-client')('http://localhost:3000/ws-game');

      this.socket.on('game-update', (gameState: any) => {
        this.updateGameState(gameState);
      });

      this.socket.on('game-error', (error: any) => {
        console.error('Game error:', error);
        this.errorSubject.next(error.message);
      });

      this.socket.on('join-game-success', () => {
        this.errorSubject.next(null);  // Clear error on successful join
      });
    }
  }

  joinGame(gameId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/api/game/join/${gameId}`, {}, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  leaveGame(gameId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/api/game/leave/${gameId}`, {}, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  emitJoinGame(gameId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const userId = this.getUserIdFromLocalStorage();
      this.socket.emit('joinGame', {gameId, userId});

      const successHandler = () => {
        this.socket.off('join-game-success', successHandler);
        this.socket.off('game-error', errorHandler);
        resolve();
      };

      const errorHandler = (error: any) => {
        this.socket.off('join-game-success', successHandler);
        this.socket.off('game-error', errorHandler);
        reject(error);
      };

      this.socket.on('join-game-success', successHandler);
      this.socket.on('game-error', errorHandler);
    });
  }

  private updateGameState(gameState: any) {
    this.currentGameStateSubject.next(gameState);
    this.gameStatusSubject.next('Spiel läuft');  // Update game status
  }

  private getUserIdFromLocalStorage(): number {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).userId : null;
  }

  // Funktion, um einen Zug zu machen
  makeMove(gameId: string, row: number, col: number): void {
    const userId = this.getUserIdFromLocalStorage();
    this.socket.emit('make-move', {gameId, userId, row, col});
  }

// WebSocket-Event-Listener für den Zug
  listenForMoves() {
    this.socket.on('move-made', (moveData: any) => {
      // Aktualisiere den Spielstatus
      this.updateGameState(moveData);
    });
  }

}
