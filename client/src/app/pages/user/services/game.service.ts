import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: WebSocket | undefined;
  private moveReceived = new Subject<any>();
  moveReceived$ = this.moveReceived.asObservable();

  //
/*
  getGameState(gameId: number): Observable<Game>{

  }
*/
  //
  makeMove(gameId: number, move: {x: number, y: number}): void{

  }

  //  Setzt das Aufgeben des Spiels um.
  resignGame(gameId: number): void {

  }

  connectToGame(gameId: number): void {

  }

  //
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
