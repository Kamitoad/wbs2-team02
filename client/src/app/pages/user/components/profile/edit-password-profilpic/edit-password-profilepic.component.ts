import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EditPasswordService} from "../../../services/edit-password.service";
import {EditProfilePicService} from "../../../services/edit-profile-pic.service";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ProfilePicComponent} from "../../profile-pic/profile-pic.component";
import {ProfileService} from "../../../services/profile.service";

@Component({
  selector: 'app-edit-password-profilpic',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    NgIf,
    ProfilePicComponent
  ],
  templateUrl: './edit-password-profilepic.component.html',
  styleUrl: './edit-password-profilepic.component.css'
})
export class EditPasswordProfilepicComponent implements OnInit {
  httpclient: HttpClient = inject(HttpClient);
  public profileService: ProfileService = inject(ProfileService);

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
    // subscribes to the ProfilePic to have it automatically reload
    this.editProfilePic.currentProfilePic$.subscribe(profilePic => {
      this.profilePic = profilePic;
    });
  }

  // Send the new ProfilePic to the server, when it is changes, using FormData
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {

      // displays Picture even before it is uploaded to Server
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.newPfp = e.target.result;
      };
      reader.readAsDataURL(file);

      // formdata used to send file to server
      const formData: FormData = new FormData();
      formData.append("file", file);

      // sends formdata profilepic to the server
      this.http.patch<{
        newProfilePic: string
      }>("http://localhost:3000/api/user/profilepic", formData, {withCredentials: true}).subscribe(
        response => {
          // instant shows the new ProfilePic
          this.editProfilePic.setProfilePic(response.newProfilePic);
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
      if (success && !success.error) {
        // instantly refreshes the Pic
        this.editProfilePic.setProfilePic(success.profilePic);
      }
    });
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  // Edit of the password
  onSubmit() {
    // Checkes if the two new passwords are the same
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

  // Used to show Error or Success messages after apssword change
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

  enableImgUpload() {
    this.imgUpload = this.editProfilePic.enableImgUpload(this.imgUpload);
  }

  closeEdit() {
    this.profileService.displayEdit = false;
  }
}
