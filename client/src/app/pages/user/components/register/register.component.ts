import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
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


  constructor(private authService: AuthService, private router: Router) {}

  httpclient: HttpClient = inject(HttpClient);

  onSubmit() {
    if (this.password !== this.confirmPassword || this.email !== this.confirmEmail) {
      return;
    }
    // If username is available -> proceed to register
    this.authService.register({
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      confirmEmail: this.confirmEmail,
      password: this.password,
      confirmPassword: this.confirmPassword,
      agb: this.agb,
    }).subscribe(() => {
      // successful registration -> navigate to  profile picture upload
      this.router.navigate(['/profile-picture']);
    });
  }
}
