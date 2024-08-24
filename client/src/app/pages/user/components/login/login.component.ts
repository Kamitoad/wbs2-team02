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
  userName: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private userService: AuthService, private router: Router) {}

  httpclient: HttpClient = inject(HttpClient);

  onSubmit() {
    let user: any = {
      userName: this.userName,
      password: this.password,
    }
    this.userService.login(user).subscribe(success => {
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
