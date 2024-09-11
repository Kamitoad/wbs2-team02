import {Component, inject, OnInit} from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import {NgClass} from "@angular/common";
import {UserdataCardComponent} from "../../../admin/components/userdata/userdata-card/userdata-card.component";
import {AuthService} from "../../../../shared/services/auth/auth.service";
import {QueueButtonComponent} from "../queue-button/queue-button.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    NgClass,
    UserdataCardComponent,
    QueueButtonComponent
  ]
})
export class ProfileComponent implements OnInit {

  public authService: AuthService = inject(AuthService);

  currentUser: any;
  userMatches: any[] =[];

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.profileService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
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
/**
  getMatchSelf(match:any):any{
    if(match.match.player1.userId===this.currentUser.userId){return match.player1.userName.toString()}
    else return match.player2.userName.toString()
  }
  getMatchOpponent(match:any):any{
    if(match.match.player1.userId!==this.currentUser.userId){return match.player2.userName.toString()}
    else return match.player1.userName.toString()
  }
**/
}
