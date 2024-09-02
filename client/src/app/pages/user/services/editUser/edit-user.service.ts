import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EditUserService {

  private user = null;
  private apiUrl = '/api/user';

  constructor() { }

  http: HttpClient = inject(HttpClient);

  editPassword(changedPassword: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/password`, changedPassword).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        return registeredUser;
      }),
      catchError((error: HttpErrorResponse) => {
        // Fehlerdetails weitergeben
        return of({
          error: true,
          status: error.status,
          message: error.message
        });
      })
    )
  }
}
