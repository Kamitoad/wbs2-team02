import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, tap, BehaviorSubject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EditProfilePicService {

  private apiUrl = '/api/user';
  private user: any;

  // RxJS BehaviorSubject, um das Profilbild zu speichern und zu teilen
  private profilePicSource = new BehaviorSubject<string>(""); // Standardwert: leeres Profilbild
  currentProfilePic$ = this.profilePicSource.asObservable();  // Observable für Komponenten

  http: HttpClient = inject(HttpClient);

  constructor() { }

  // Umschalten für Bild-Upload
  enableImgUpload(imgUpload: boolean): boolean {
    return !imgUpload;
  }

  // Profilbild vom Server abrufen und lokalen Wert setzen
  getProfilePic() {
    return this.http.get<any>(`${this.apiUrl}/profilepic`).pipe(
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

  // Profilbild auf dem Server löschen und lokalen Wert aktualisieren
  deleteProfilePic() {
    return this.http.delete<any>(`${this.apiUrl}/profilepic`).pipe(
      tap(registeredUser => {
        this.user = registeredUser;
        if (registeredUser && registeredUser.profilePic === "") {
          // Setze das Profilbild auf Standard, wenn gelöscht
          this.profilePicSource.next(""); // Leeres Bild oder Standardbild
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

  // Methode, um das Profilbild explizit zu setzen (z.B. nach einem Upload)
  setProfilePic(newProfilePic: string) {
    this.profilePicSource.next(newProfilePic);
  }
}
