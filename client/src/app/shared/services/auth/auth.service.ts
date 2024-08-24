import {inject, Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user = null;
  private apiUrl = '/api/auth';

  constructor() {
  }

  http: HttpClient = inject(HttpClient);

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        return registeredUser;
      }),
    );
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        return registeredUser;
      }),
    );
  }
}
