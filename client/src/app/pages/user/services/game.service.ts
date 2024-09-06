import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: WebSocket | undefined;
  private moveReceived = new Subject<any>();
  moveReceived$ = this.moveReceived.asObservable();

  connectToGame(gameId: number): void {
    this.socket = new WebSocket(`ws://localhost:3000/game/${gameId}`);

    this.socket.onmessage = (event) => {
      const move = JSON.parse(event.data);
      this.moveReceived.next(move);
    }
  }

  sendMove(move: { row: number, col: number, player: string, gameId: number }): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(move));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
