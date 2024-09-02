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
        this.socket = io('http://localhost:3000');

        this.socket.on('gameUpdated', (data: any) => {
            this.gameUpdatedSubject.next(data);
        });

        this.socket.on('gameCreated', (data: any) => {
            this.gameCreatedSubject.next(data);
        });
    }

    createGame(player1Id: number, player2Id: number): void {
        this.socket.emit('createGame', { player1Id, player2Id });
    }

    makeMove(gameId: number, move: { field: string; value: number }): void {
        this.socket.emit('makeMove', { gameId, move });
    }

    getGameById(gameId: number): Observable<any> {
        return this.gameCreatedSubject.asObservable();
    }

    updateGameWithResult(id: number, winner: number, changeEloPlayer1: number) {
        return undefined;
    }
}
