import {Component, inject, OnInit} from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import {NgClass} from "@angular/common";
import {UserdataCardComponent} from "../../../admin/components/userdata/userdata-card/userdata-card.component";
import {AuthService} from "../../../../shared/services/auth/auth.service";
import {QueueButtonComponent} from "../queue-button/queue-button.component";
import {EditPasswordProfilepicComponent} from "../edit-password-profilpic/edit-password-profilepic.component";
import {ProfilePicComponent} from "../profile-pic/profile-pic.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    NgClass,
    UserdataCardComponent,
    QueueButtonComponent,
    EditPasswordProfilepicComponent,
    ProfilePicComponent
  ]
})
export class ProfileComponent implements OnInit {

  public authService: AuthService = inject(AuthService);
  public profileService: ProfileService = inject(ProfileService);

  currentUser: any;
  userMatches: any[] =[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.profileService.getCurrentUser().subscribe({
      next: () => {},
      error: () => {
        this.router.navigate(['login']);
      }
    });
    this.loadUserData();
  }

  loadUserData(): void {
    this.profileService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
      localStorage.setItem("user", JSON.stringify(data));
    });
    this.profileService.getUserMatches().subscribe(matches => {
      this.userMatches = matches;
    });
  }

  joinQueue(): void {
    this.profileService.joinQueue().subscribe(() => {
      this.router.navigate(['/queue']);
    });
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

  getMatchResultClass(match:any):string{
    if(match.winner===this.currentUser.userId){return 'win'}
    else if (match.loser===this.currentUser.userId){return 'loss'}
    return 'tie';
  }
  getMatchResultText(match:any):string{
    if(match.winner===this.currentUser.userId){return 'Gewonnen'}
    else if (match.loser===this.currentUser.userId){return 'Verloren'}
    return 'Unentschieden';
  }

  getMatchSelf(match:any):any{
    if(match.player1.userId===this.currentUser.userId){return `${match.player1.userName} (${match.changeEloPlayer1})`}
    else return `${match.player2.userName} (${match.changeEloPlayer2})`
  }
  getMatchOpponent(match:any):any{
    if(match.player1.userId!==this.currentUser.userId){return `${match.player1.userName} (${match.changeEloPlayer1})`}
    else return `${match.player2.userName} (${match.changeEloPlayer2})`
  }

  toggleEdit(){
    this.profileService.displayEdit = true;
  }

}
