import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../../../shared/services/auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EditUserService} from "../../../services/editUser/edit-user.service";
import {subscribe} from "node:diagnostics_channel";


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

  @ViewChild('#messageError') messageError: ElementRef<HTMLSpanElement> | undefined;
  @ViewChild('#messageSuccess') messageSuccess: ElementRef<HTMLSpanElement> | undefined;

  oldPasword: string = "";
  newPassword: string = "";
  newPasswordConfirm: string = "";


  constructor(private editUser: EditUserService, private router: Router) {
  }

  onSubmit() {
    if (this.newPassword == this.newPasswordConfirm) {
      let changedPassword: any = {
        oldPassword: this.oldPasword,
        newPassword: this.newPassword
      }
      this.editUser.editPassword(changedPassword).subscribe(success => {
        if (success.error) {
          if (this.messageError) {
            this.messageError.nativeElement.textContent = "Altes Passwort nicht korrekt";
          }
          this.showMessage('messageError', 5000);
        } else if (success) {
          if (this.messageSuccess) {
            this.messageSuccess.nativeElement.textContent = "Password erfolgreich geändert";
          }
          this.showMessage('messageSuccess', 5000);
          this.clearInputFields();
        }
      });
    } else {
      if (this.messageError) {
        this.messageError.nativeElement.textContent = "Neue Passwörter nicht gleich";
      }
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
