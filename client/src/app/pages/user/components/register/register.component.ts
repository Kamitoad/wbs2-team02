import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    RouterLink,
    NgClass,
  ],
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  confirmPassword: string = '';
  usernameTaken: boolean = false;
  agb: boolean = false;

  statusMessage: string = " ";

  constructor(private authService: AuthService, private router: Router) {}

  httpclient: HttpClient = inject(HttpClient);

  onSubmit() {
    const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;

    this.userName = this.userName.trim();
    this.firstName = this.firstName.trim();
    this.lastName = this.lastName.trim();
    this.email = this.email.trim();
    this.confirmEmail = this.confirmEmail.trim();
    this.password = this.password.trim();
    this.confirmPassword = this.confirmPassword.trim();

    // Validierung für den Benutzernamen
    if (!usernameRegex.test(this.userName)) {
      if (this.userName.length < 6) {
        this.statusMessage = "Dein Nutzername muss mindestens 6 Zeichen lang sein";
      } else if (this.userName.length > 20) {
        this.statusMessage = "Dein Nutzername darf nicht länger als 20 Zeichen sein";
      } else {
        this.statusMessage = "Dein Nutzername darf nur Buchstaben und Zahlen enthalten";
      }
      this.removeStatusMessage();
      return;
    }

    if (this.email !== this.confirmEmail) {
      this.statusMessage = "Bitte bestätige deine Email";
      this.removeStatusMessage();
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.statusMessage = "Bitte bestätige dein Passwort";
      this.removeStatusMessage();
      return;
    }

    if (!this.userName || !this.firstName || !this.lastName || !this.email ||
      !this.confirmEmail || !this.password || !this.confirmPassword
    ) {
      this.statusMessage = "Bitte fülle alle Felder aus";
      this.removeStatusMessage();
      return;
    }

    this.authService.register({
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      confirmEmail: this.confirmEmail,
      password: this.password,
      confirmPassword: this.confirmPassword,
      agb: this.agb,
    }).subscribe({
      next: () => {
        this.statusMessage = "Du wurdest erfolgreich registriert"
        setTimeout(() => {
          this.router.navigate(['/profile-picture']);
        }, 2000)
      },
      error: (error) => {
        console.error(error)
        if (error.error?.message) {
          const messages = error.error.message;
          for (let message of messages) {
            if (message == "email must be an email") {
              this.statusMessage = "Bitte gib eine gültige Email ein"
              this.removeStatusMessage();
              return;
            } else if (message == "userName must be shorter than or equal to 20 characters") {
              this.statusMessage = "Dein Nutzername darf nicht länger als 20 Zeichen sein"
              this.removeStatusMessage();
              return;
            } else if (message == "userName must be longer than or equal to 6 characters") {
              this.statusMessage = "Dein Nutzername darf nicht kürzer als 6 Zeichen sein"
              this.removeStatusMessage();
              return;
            }
          }
        } else {
          this.statusMessage = error.error.message || "Ein unbekannter Fehler ist aufgetreten.";
        }
        this.removeStatusMessage()
      }
    });
  }
  removeStatusMessage(): void {
    setTimeout(() => {
      this.statusMessage = " ";
    }, 5000);
  }
}
