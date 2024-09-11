import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {EditProfilePicService} from "../../services/editProfilePic/edit-profile-pic.service";


@Component({
  selector: 'app-profile-pic',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './profile-pic.component.html',
  styleUrl: './profile-pic.component.css'
})
export class ProfilePicComponent implements OnInit {

  profilePic: string = "";

  @Input() userName: string = "";

  constructor(private editProfilePic: EditProfilePicService) {}

  ngOnInit() {
    if (this.userName) {
      console.log(this.userName);
      this.editProfilePic.getProfilePicOfUser(this.userName).subscribe((response: any) => {
        this.profilePic = response.profilePic || '';
      });
    } else {
      this.editProfilePic.getProfilePic().subscribe((response: any) => {
        this.profilePic = response.profilePic || '';
      });
    }
  }
  protected readonly window = window;
}
