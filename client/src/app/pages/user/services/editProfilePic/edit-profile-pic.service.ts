import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, tap, BehaviorSubject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EditProfilePicService {
  private apiUrl = '/api/user';
  private user: any;

  private profilePicSource = new BehaviorSubject<string>(""); // Standardwert: leeres Profilbild
  currentProfilePic$ = this.profilePicSource.asObservable();  // Observable für Komponenten

  http: HttpClient = inject(HttpClient);

  constructor() {}

  enableImgUpload(imgUpload: boolean): boolean {
    return !imgUpload;
  }

  getProfilePic() {
    return this.http.get<any>(`${this.apiUrl}/profilepic`).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic) {
          this.profilePicSource.next(registeredUser.profilePic); // Profilbild aktualisieren
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

  deleteProfilePic() {
    return this.http.delete<any>(`${this.apiUrl}/profilepic`).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic === "") {
          this.profilePicSource.next(""); // Profilbild nach dem Löschen zurücksetzen
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
  // Profilbild vom Server abrufen und lokalen Wert setzen
  getProfilePicOfUser(userName: string) {
    return this.http.get<any>(`${this.apiUrl}/profilepic/user/` + userName).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic) {
          // Wenn erfolgreich, Profilbild aktualisieren
          this.profilePicSource.next(registeredUser.profilePic);
        }
        return registeredUser;
      }),
      catchError((error: HttpErrorResponse) => {
        // Fehlerbehandlung
        return of({
          error: true,
          status: error.status,
          message: error.message
        });
      })
    );
  }
  setProfilePic(newProfilePic: string) {
    this.profilePicSource.next(newProfilePic); // Profilbild manuell setzen und teilen
  }
}
