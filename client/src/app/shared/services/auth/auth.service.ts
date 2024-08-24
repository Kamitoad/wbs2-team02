import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor() {}
  http: HttpClient = inject(HttpClient);

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }
}
