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
    // Abhängig davon, ob ein Benutzername übergeben wurde, das Bild des Nutzers oder das eigene Profilbild abrufen
    if (this.userName) {
      this.editProfilePic.getProfilePicOfUser(this.userName).subscribe((response: any) => {
        this.updateProfilePic(response.profilePic);
      });
    } else {
      // Abonniere das Observable, um auf zukünftige Änderungen des Profilbilds zu reagieren
      this.editProfilePic.currentProfilePic$.subscribe((profilePic) => {
        this.updateProfilePic(profilePic);
      });

      // Initiales Laden des Profilbilds
      this.editProfilePic.getProfilePic().subscribe((response: any) => {
        this.updateProfilePic(response.profilePic);
      });
    }
  }

  // Methode, um das Profilbild mit einem Cache-Busting-Parameter zu aktualisieren
  updateProfilePic(profilePic: string) {
    this.profilePic = profilePic ? `${profilePic}?t=${new Date().getTime()}` : '../../../../../assets/default-profile.png';
  }

  protected readonly window = window;
}
