import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../../../shared/services/auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EditPasswordService} from "../../../services/editUser/edit-password.service";
import {EditProfilePicService} from "../../../services/editProfilePic/edit-profile-pic.service";
import {subscribe} from "node:diagnostics_channel";
import {NgIf, NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-edit-password-profilpic',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './edit-password-profilepic.component.html',
  styleUrl: './edit-password-profilepic.component.css'
})
export class EditPasswordProfilepicComponent implements OnInit {
  httpclient: HttpClient = inject(HttpClient);

  @ViewChild('#messageError') messageError: ElementRef<HTMLSpanElement> | undefined;
  @ViewChild('#messageSuccess') messageSuccess: ElementRef<HTMLSpanElement> | undefined;

  oldPasword: string = "";
  newPassword: string = "";
  newPasswordConfirm: string = "";

  profilePic: string = "";
  imgUpload: boolean = false;
  private newPfp: any;
  protected errorMessage: string | undefined;

  constructor(private http: HttpClient, private editUser: EditPasswordService, private editProfilePic: EditProfilePicService, private router: Router) {
  }


  ngOnInit() {
    this.editProfilePic.getProfilePic().subscribe(success => {
      if (success.error) {
      } else if (success) {
        this.profilePic = success.profilePic;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.newPfp = e.target.result;
      };

      reader.readAsDataURL(file);
      const formData: FormData = new FormData();
      formData.append("file", file);

      this.http.patch<{ newProfilePic: string }>("http://localhost:3000/api/user/profilepic", formData, { withCredentials: true }).subscribe(
        response => {
          this.profilePic = response.newProfilePic; // Aktualisiere das Profilbild
          this.refreshCurrentRoute(); // Route neu laden
          this.enableImgUpload();
        },
        error => {
          this.errorMessage = "Etwas ist schiefgelaufen";
          this.removeErrorMessage();
        }
      );
    }
  }

  deleteProfilePic() {
    this.editProfilePic.deleteProfilePic().subscribe(success => {
      if (success.error) {
      } else if (success) {
        this.profilePic = success.profilePic;

        this.refreshCurrentRoute(); // Route neu laden
      }
    });

  }


  refreshCurrentRoute() {
    // Navigiere zur aktuellen Route mit einem Trick, um die Route neu zu laden
    this.router.navigate([this.router.url]).then(() => {
      // Optional: Hier kannst du zusätzliche Logik hinzufügen, die nach dem Neuladen der Route ausgeführt werden soll
    });
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
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

  protected readonly window = window;
  protected readonly onclick = onclick;

  enableImgUpload() {
    this.imgUpload = this.editProfilePic.enableImgUpload(this.imgUpload);
  }


}
