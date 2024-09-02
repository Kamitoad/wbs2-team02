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
    if(this.newPassword == this.newPasswordConfirm){
      let changedPassword: any = {
        oldPassword: this.oldPasword,
        newPassword: this.newPassword
      }
      this.authService.passwordChange(changedPassword).subscribe(success => {
        if (success) {
          console.log("success");
          this.showMessage('messageSuccess', 5000);
          this.clearInputFields();

        } else {
          console.log("error");
          this.showMessage('messageError', 5000);
        }
      });
    } else {
      this.showMessage('messageError', 5000);
    }


  }

  showMessage(elementId: string, duration: number) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'inline'; // Show the message
      setTimeout(() => {
        element.style.display = 'none'; // Hide the message after the duration
      }, duration);
    }
  }

  clearInputFields() {
    this.oldPasword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
  }
}
