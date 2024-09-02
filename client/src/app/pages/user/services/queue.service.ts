import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private apiUrl = 'http://localhost:3000/api/queue';

  constructor(private http: HttpClient) {}

  joinQueue(): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/join`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  leaveQueue(): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/leave`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
