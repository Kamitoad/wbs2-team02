import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import {NgClass} from "@angular/common";
import {UserdataCardComponent} from "../../../admin/components/userdata/userdata-card/userdata-card.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    NgClass,
    UserdataCardComponent
  ]
})
export class ProfileComponent implements OnInit {
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
    this.profileService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  getMatchResultClass(match: any): string {
    return match.result === 'win' ? 'win' : match.result === 'tie' ? 'tie' : 'loss';
  }

  getMatchResultText(match: any): string {
    return match.result === 'win' ? 'Gewonnen' : match.result === 'tie' ? 'Unentschieden' : 'Verloren';
  }
}
