import {inject, Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  http: HttpClient = inject(HttpClient);

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap(registeredUser => {
        // Local storage because services are cleared after a page reload or self typed URL-Change
        localStorage.setItem('user', JSON.stringify(registeredUser));
      }),
    );
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(loggedInUser => {
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }),
    );
  }

  logout(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, user).pipe(
      tap(() => {
        localStorage.removeItem('user');
      }),
    );
  }



}
