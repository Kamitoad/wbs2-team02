import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket;
  private gameUpdatedSubject = new Subject<any>();
  private gameCreatedSubject = new Subject<any>();

  constructor() {
    // Ersetze 'http://localhost:3000' durch die URL deines Servers
    this.socket = io('http://localhost:3000');

    // Reagiere auf Ereignisse vom Server
    this.socket.on('gameUpdated', (data) => {
      this.gameUpdatedSubject.next(data);
    });

    this.socket.on('gameCreated', (data) => {
      this.gameCreatedSubject.next(data);
    });
  }

  // Sendet eine Anfrage zum Erstellen eines neuen Spiels
  createGame(player1Id: number, player2Id: number): void {
    this.socket.emit('createGame', { player1Id, player2Id });
  }

  // Sendet einen Zug des Spielers
  makeMove(gameId: number, move: { field: `${number}-${number}`; value: "X" | "O" }): void {
    this.socket.emit('makeMove', { gameId, move });
  }

  // Erhält Updates zu einem Spiel
  getGameUpdates(): Observable<any> {
    return this.gameUpdatedSubject.asObservable();
  }

  // Erhält Informationen über ein neu erstelltes Spiel
  getGameCreated(): Observable<any> {
    return this.gameCreatedSubject.asObservable();
  }
}
