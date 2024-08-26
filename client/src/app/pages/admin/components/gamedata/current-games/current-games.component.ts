import { Component } from '@angular/core';
import {CurrentGamesCardComponent} from "./current-games-card/current-games-card.component";
import {GamedataService} from "../../../services/gamedata.service";

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

  constructor(private gamedataService: GamedataService) {}

  ngOnInit(): void {
    this.gamedataService.currentGames$.subscribe((currentGames: any[]) => {
      this.currentGames = currentGames;
    });
  }
}
