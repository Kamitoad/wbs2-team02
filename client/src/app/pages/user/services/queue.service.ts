import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private opponentSubject = new BehaviorSubject<any | null>(null);
  opponent$ = this.opponentSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);

  private gameStatusSubject = new BehaviorSubject<string | null>(null);  // Neue Subject für den Spielstatus
  gameStatus$ = this.gameStatusSubject.asObservable();


  private socket: any;
  private baseUrl: string;  //Needed to test project rather in Angular or Nest.js Server

  constructor(
    private http: HttpClient,
  //@ts-ignore
  @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://localhost:3000';

    //To make sure Angular can be build properly with sockets to test with Nest.js
    if(isPlatformBrowser(this.platformId)) {
      this.socket = require('socket.io-client')('http://localhost:3000/ws-user-queue');

      this.socket.on('opponent-data', (opponent: any) => {
        this.readOpponent(opponent);
      });

      this.socket.on('queue-error', (error: any) => {
        console.error('Queue error:', error);
        this.errorSubject.next(error.message);  // Setze den Fehler im Fehler-Subject
      });

      // Setze den Fehler auf null, wenn die Verbindung erfolgreich ist
      this.socket.on('join-queue-success', () => {
        this.errorSubject.next(null);
      });
    }
  }

  joinQueue(): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/api/queue/join`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  leaveQueue(): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/api/queue/leave`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  initiateSocketConnection() {
    this.socket.on('opponent-data', (opponent: any) => {
      this.opponentSubject.next(opponent);
    });
  }

  emitJoinQueue(): Promise<void> {
    return new Promise((resolve, reject) => {
      const userId = this.getUserIdFromLocalStorage();
      this.socket.emit('joinQueue', { userId });

      const successHandler = () => {
        this.socket.off('join-queue-success', successHandler);
        this.socket.off('queue-error', errorHandler);
        resolve();
      };

      const errorHandler = (error: any) => {
        this.socket.off('join-queue-success', successHandler);
        this.socket.off('queue-error', errorHandler);
        reject(error);
      };

      this.socket.on('join-queue-success', successHandler);
      this.socket.on('queue-error', errorHandler);
    });
  }

  private readOpponent(opponent: any) {
    this.opponentSubject.next(opponent);
    this.gameStatusSubject.next('Spiel wird gestartet');  // Status aktualisieren
  }

  private getUserIdFromLocalStorage(): number {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).userId : null;
  }
}
