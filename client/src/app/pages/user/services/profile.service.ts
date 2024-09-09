import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/user';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`);
  }

  getUserMatches(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/matches`);
  }

  joinQueue(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/queue`, {});
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {});
  }
}
