import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {EditPasswordService} from "../../services/editUser/edit-password.service";
import {EditProfilePicService} from "../../services/editProfilePic/edit-profile-pic.service";
import {Router} from "@angular/router";


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

  constructor(private editProfilePic: EditProfilePicService) {}

  ngOnInit() {
    // Abonniere das Observable für das Profilbild
    this.editProfilePic.currentProfilePic$.subscribe(newProfilePic => {
      this.profilePic = newProfilePic;
    });

    // Initiales Laden des Profilbilds
    this.editProfilePic.getProfilePic().subscribe();
  }
    protected readonly window = window;
}
