import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  private socket: any;
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();
  private baseUrl: string;  //Needed to test project rather in Angular or Nest.js Server

  constructor(
    private http: HttpClient,
    //@ts-ignore
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseUrl = isPlatformBrowser(this.platformId) ? '' : 'http://localhost:3000';

    //To make sure Angular can be build properly with sockets to test with Nest.js
    if(isPlatformBrowser(this.platformId)) {
      this.socket = require('socket.io-client')('http://localhost:3000/ws-admin-userdata');

      this.socket.on('editUser-registered', (newUser: any) => {
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
    return this.http.get<any[]>(`${this.baseUrl}/api/userdata/allUsers`);
  }

  private addUser(newUser: any) {
    const currentUsers = this.usersSubject.getValue();
    this.usersSubject.next([...currentUsers, newUser]);
  }
}
