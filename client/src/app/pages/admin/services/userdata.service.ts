import {Inject, inject, Injectable, PLATFORM_ID} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  private socket: any;
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(
    private http: HttpClient,
    // @ts-ignore
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if(isPlatformBrowser(this.platformId)) {
      this.socket = require('socket.io-client')('http://localhost:3000/user'); // Deine Server-URL
      this.socket.on('connect', () => {
      });
      this.socket.on('user-registered', (newUser: any) => {
        this.addUser(newUser);
      });
    }
    this.loadInitialUsers();
  }

  private loadInitialUsers() {
    this.getUsers().subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/api/userdata/allUsers');
  }

  private addUser(newUser: any) {
    const currentUsers = this.usersSubject.getValue();
    this.usersSubject.next([...currentUsers, newUser]);
  }
}
