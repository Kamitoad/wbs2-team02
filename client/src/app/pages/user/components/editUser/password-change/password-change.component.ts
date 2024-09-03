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
          this.showMessage('messageErrorOld', 5000);
        } else if (success) {

          this.showMessage('messageSuccess', 5000);
          this.clearInputFields();
        }
      });
    } else {

      this.showMessage('messageErrorNew', 5000);
    }


  }

  showMessage(elementId: string, duration: number) {
    const element = document.getElementById(elementId);
    console.log(element)
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
