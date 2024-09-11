import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import {FormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  httpclient: HttpClient = inject(HttpClient);

  userName: string = '';
  password: string = '';
  statusMessage: string = " ";

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    let user: any = {
      userName: this.userName,
      password: this.password,
    }
    /*
    this.authService.login(user).subscribe(success => {
      if (success) {
        this.router.navigate(['/profile']);
      } else {
        this.statusMessage = "Falscher Nutzername oder falsches Passwort";
        this.removeStatusMessage()
      }
    });
    */
    this.authService.login(user).subscribe({
      next: (response) => {
        // Hier prüfen, ob die Rolle 'admin' ist und entsprechend weiterleiten
        if (response.role === 'admin') {
          this.router.navigate(['/admin/user']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (error) => {
        // Fehler anzeigen
        this.statusMessage = error.error.message || "Ein unbekannter Fehler ist aufgetreten";
        this.removeStatusMessage();
      }
    });
  }

  removeStatusMessage(): void {
    setTimeout(() => {
      this.statusMessage = " ";
    }, 5000);
  }
}
