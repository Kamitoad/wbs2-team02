import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import {FormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ProfileService} from "../../services/profile.service";

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    /*
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.router.navigate(['profile']);
    }
    */

    this.profileService.getCurrentUser().subscribe({
      next: () => { this.router.navigate(['profile']); },
      error: () => {}
    });
  }

  onSubmit() {
    this.userName = this.userName.trim();
    this.password = this.password.trim();

    let user: any = {
      userName: this.userName,
      password: this.password,
    }
    this.authService.login(user).subscribe({
      next: (response) => {
        if (response.role === 'admin') {
          this.router.navigate(['/admin/user']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: () => {
        this.statusMessage = "Falscher Nutzername oder Passwort";
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
