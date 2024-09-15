import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from "@angular/common";
import { EditProfilePicService } from "../../services/editProfilePic/edit-profile-pic.service";

@Component({
  selector: 'app-profile-pic',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile-pic.component.html',
  styleUrl: './profile-pic.component.css'
})
export class ProfilePicComponent implements OnInit {

  profilePic: string = "";

  @Input() userName: string = "";

  constructor(private editProfilePic: EditProfilePicService) {}

  ngOnInit() {
    // If a Username is given, gets the Pic of the specific user
    if (this.userName) {

      this.editProfilePic.getProfilePicOfUser(this.userName).subscribe((response: any) => {
        this.updateProfilePic(response.newProfilePic);
      });

    } else {
      // gets Pic of logged in User

      this.editProfilePic.currentProfilePic$.subscribe((profilePic) => {
        this.updateProfilePic(profilePic);
      });

      this.editProfilePic.getProfilePic().subscribe((response: any) => {
        this.updateProfilePic(response.newProfilePic);
      });
    }
  }

  // updates the ProfilePic through giving it a timestamp, so the Browser notices a change
  // if there is no ProfilePic, give the default Pic
  updateProfilePic(profilePic: string) {
    this.profilePic = profilePic ? `${profilePic}?t=${new Date().getTime()}` : '../../../../../assets/default-profile.png';
  }

  protected readonly window = window;
}
