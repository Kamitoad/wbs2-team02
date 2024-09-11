import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/game';
  private socket = io('http://localhost:3000'); // WebSocket-Verbindung
  private currentPlayer: 'X' | 'O' = 'X'; // Der Spieler, der aktuell am Zug ist
  gameId!: number; // Speichere die gameId hier für spätere Zugriffe

  // Subject für WebSocket-Zug-Updates
  moveSubject = new Subject<{ row: number, col: number, player: 'X' | 'O' }>();

  constructor(private http: HttpClient) {
    this.setupSocketListeners();
  }

  // Methode zum Erstellen eines neuen Spiels
  createGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {}).pipe(
      tap((response: any) => {
        this.gameId = response.gameId; // Speichere die gameId beim Erstellen des Spiels
      })
    );
  }

  // Methode zum Abrufen des Spielstatus
  getGameState(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${gameId}`);
  }


  // Methode zum Ausführen eines Zuges
  makeMove(row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.gameId}/move`, {row, col, player: this.currentPlayer});
  }

  // WebSocket-Verbindung einrichten
// Debuggen der WebSocket-Verbindung
  private setupSocketListeners() {
    this.socket.on('move', (data: { row: number, col: number, player: 'X' | 'O' }) => {
      console.log(`Move received from server:`, data);
      this.moveSubject.next(data);
    });

    this.socket.on('winner', (data: any) => {
      console.log(`Winner detected: ${data.winner}`);
    });
  }

// Debuggen von Spielzügen
  emitMove(row: number, col: number) {
    console.log(`Emitting move: Row: ${row}, Col: ${col}, Player: ${this.currentPlayer}`);
    this.socket.emit('move', {gameId: this.gameId, row, col, player: this.currentPlayer});
  }
}
