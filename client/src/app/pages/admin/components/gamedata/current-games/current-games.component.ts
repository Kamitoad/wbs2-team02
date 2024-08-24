import { Component } from '@angular/core';
import {CurrentGamesCardComponent} from "./current-games-card/current-games-card.component";

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

}
