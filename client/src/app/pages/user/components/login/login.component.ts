import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  httpclient: HttpClient = inject(HttpClient);

  userName: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    let user: any = {
      userName: this.userName,
      password: this.password,
    }
    this.authService.login(user).subscribe(success => {
      if (success) {
        this.router.navigate(['/profile']);
      } else {
        this.loginFailed = true;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
