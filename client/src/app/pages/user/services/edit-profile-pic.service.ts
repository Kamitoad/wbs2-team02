import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, tap, BehaviorSubject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EditProfilePicService {
  private apiUrl = '/api/user';
  private user: any;

  private profilePicSource = new BehaviorSubject<string>("");
  currentProfilePic$ = this.profilePicSource.asObservable();

  http: HttpClient = inject(HttpClient);

  constructor() {}

  enableImgUpload(imgUpload: boolean): boolean {
    return !imgUpload;
  }

  // Gets the ProfilePic of the logged-in user
  getProfilePic() {
    return this.http.get<any>(`${this.apiUrl}/profilepic`).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic) {
          this.profilePicSource.next(registeredUser.profilePic);
        }
        return registeredUser;
      }),
      catchError((error: HttpErrorResponse) => {
        return of({
          error: true,
          status: error.status,
          message: error.message
        });
      })
    );
  }

  // sets the ProfilePic to the standard one
  deleteProfilePic() {
    return this.http.delete<any>(`${this.apiUrl}/profilepic`).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic === "") {
          this.profilePicSource.next("");
        }
        return registeredUser;
      }),
      catchError((error: HttpErrorResponse) => {
        return of({
          error: true,
          status: error.status,
          message: error.message
        });
      })
    );
  }

  // Gets ProfilePic of a specific username
  getProfilePicOfUser(userName: string) {
    return this.http.get<any>(`${this.apiUrl}/profilepic/user/` + userName).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic) {
          this.profilePicSource.next(registeredUser.profilePic);
        }
        return registeredUser;
      }),
      catchError((error: HttpErrorResponse) => {
        return of({
          error: true,
          status: error.status,
          message: error.message
        });
      })
    );
  }

  setProfilePic(newProfilePic: string) {
    this.profilePicSource.next(newProfilePic);
  }
}
