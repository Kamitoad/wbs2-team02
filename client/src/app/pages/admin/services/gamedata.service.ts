import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, interval, map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class GamedataService {

  private gameSocket: any;
  private queueSocket: any;
  private currentGamesSubject = new BehaviorSubject<any[]>([]);
  private usersInQueueSubject = new BehaviorSubject<any[]>([]);

  currentGames$ = this.currentGamesSubject.asObservable();
  usersInQueue$ = this.usersInQueueSubject.asObservable();
  private baseUrl: string;  //Needed to test project rather in Angular or Nest.js Server

  constructor(
    private http: HttpClient,
    //@ts-ignore
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://localhost:3000';

    //To make sure Angular can be build properly with sockets to test with Nest.js
    if (isPlatformBrowser(this.platformId)) {
      this.gameSocket = require('socket.io-client')('http://localhost:3000/ws-admin-gamedata');
      this.queueSocket = require('socket.io-client')('http://localhost:3000/ws-user-queue');

      this.gameSocket.on('game-added', (newGame: any) => {
        this.addGame(newGame);
      });

      this.gameSocket.on('game-ended', (gameId: any) => {
        this.removeGame(gameId);
      });

      this.gameSocket.on('queue-user-added', (user: any) => {
        this.addUserToQueue(user);
      });

      this.gameSocket.on('queue-user-removed', (userId: number) => {
        this.removeUserFromQueue(userId);
      });
    }
    this.loadInitialCurrentGames();
    this.loadInitialUsersInQueue();
    this.startQueueTimer();
  }

  private loadInitialCurrentGames() {
    this.getCurrentGames().subscribe(games => {
      this.currentGamesSubject.next(games);
    });
  }

  getCurrentGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/admin/gamedata/allCurrentGames`);
  }

  private loadInitialUsersInQueue() {
    this.getUsersInQueue().subscribe(users => {
      this.usersInQueueSubject.next(users);
    });
  }

  getUsersInQueue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/admin/gamedata/queue`);
  }

  private addGame(newGame: any) {
    const currentGames = this.currentGamesSubject.getValue();
    this.currentGamesSubject.next([...currentGames, newGame]);
  }

  private removeGame(gameId: string) {

    const currentGames = this.currentGamesSubject.getValue();
    const updatedGames = currentGames.filter(game => game.gameId !== gameId);
    this.currentGamesSubject.next(updatedGames);
  }

  private addUserToQueue(user: any) {
    const users = this.usersInQueueSubject.getValue();
    this.usersInQueueSubject.next([...users, user]);
  }

  private removeUserFromQueue(userId: number) {
    const users = this.usersInQueueSubject.getValue();
    const updatedUsers = users.filter(user => user.userId !== userId);
    this.usersInQueueSubject.next(updatedUsers);
  }

  private startQueueTimer() {
    if (isPlatformBrowser(this.platformId)) {
      interval(1000).pipe(
        map(() => this.usersInQueueSubject.getValue().map(user => ({
          ...user,
          duration: this.calcQueueDuration(user.queueStartTime)
        })))
      ).subscribe(updatedUsers => {
        this.usersInQueueSubject.next(updatedUsers);
      });
    }
  }

  private calcQueueDuration(queueStartTimeDate: string): number {
    const now = Date.now();
    const queueStartTime = new Date(queueStartTimeDate).getTime();
    return Math.floor((now - queueStartTime) / 1000);
  }
}
