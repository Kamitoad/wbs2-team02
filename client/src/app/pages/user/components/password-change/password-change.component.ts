import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {
  httpclient: HttpClient = inject(HttpClient);

  oldPasword: string = "";
  newPassword: string = "";
  newPasswordConfirm: string = "";


  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    let user: any = {
      oldPassword: this.oldPasword,
      newPassword: this.newPassword,
      newPasswordConfirm: this.newPasswordConfirm,
    }
    this.authService.login(user).subscribe(success => {
      if (success) {
        this.router.navigate(['/profile']);
      } else {
        this.loginFailed = true;
      }
    });
  }
}
