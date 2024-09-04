import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class EditProfilePicService {

  private apiUrl = '/api/user';
  private user: any;
  private newPfp: any;

  constructor() { }
  http: HttpClient = inject(HttpClient);

  enableImgUpload(imgUpload: boolean): boolean {
   return !imgUpload;
  }

  getProfilePic() {

    return this.http.get<any>(`${this.apiUrl}/profilepic`).pipe(

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

  deleteProfilePic() {

    return this.http.delete<any>(`${this.apiUrl}/profilepic`).pipe(

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
