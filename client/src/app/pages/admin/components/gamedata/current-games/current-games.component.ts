import { Component } from '@angular/core';
import {CurrentGamesCardComponent} from "./current-games-card/current-games-card.component";
import {GamedataService} from "../../../services/gamedata.service";
import {Router} from "@angular/router";
import {ProfileService} from "../../../../user/services/profile.service";

@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [
    CurrentGamesCardComponent
  ],
  templateUrl: './current-games.component.html',
  styleUrl: './current-games.component.css'
})
export class CurrentGamesComponent {
  currentGames: any = [];

  constructor(
    private gamedataService: GamedataService,
    private profileService: ProfileService,
    private router: Router) {}

  ngOnInit(): void {
    this.profileService.getCurrentUser().subscribe({
      next: (res) => {
        if (res.role !== "admin") {
          this.router.navigate(['/profile']);
        }
      },
      error: () => {
        this.router.navigate(['login']);
      }
    });

    this.gamedataService.currentGames$.subscribe((currentGames: any[]) => {
      this.currentGames = currentGames;
    });
  }
}
