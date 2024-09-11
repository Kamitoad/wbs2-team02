import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/game';
  private socket = io('http://localhost:3000'); // WebSocket-Verbindung
  private currentPlayer: 'X' | 'O' = 'X'; // Der Spieler, der aktuell am Zug ist

  constructor(private http: HttpClient) {
    this.setupSocketListeners();
  }

  // Methode zum Erstellen eines neuen Spiels
  createGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {});
  }

  // Methode zum Abrufen des Spielstatus
  getGameState(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${gameId}`);
  }

  // Methode zum Ausführen eines Zuges
  makeMove(gameId: number, row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${gameId}/move`, { row, col, player: this.currentPlayer });
  }

  // Methode zur Überprüfung des Gewinners
  checkWinner(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${gameId}/winner`);
  }

  // WebSocket-Verbindung einrichten
  private setupSocketListeners() {
    this.socket.on('move', (data: any) => {
      // Handle move updates
    });

    this.socket.on('winner', (data: any) => {
      // Handle winner updates
    });
  }

  // Methode zum Emitten von Zügen
  emitMove(gameId: number, row: number, col: number) {
    this.socket.emit('move', { gameId, row, col, player: this.currentPlayer });
  }
}
