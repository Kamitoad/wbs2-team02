import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/user';

  constructor() {}
  http: HttpClient = inject(HttpClient);

  checkUsername(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/checkUsername`, { username });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { user });
  }
}
