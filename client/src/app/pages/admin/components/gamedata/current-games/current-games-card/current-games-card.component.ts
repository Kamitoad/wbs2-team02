import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-current-games-card',
  standalone: true,
  imports: [],
  templateUrl: './current-games-card.component.html',
  styleUrl: './current-games-card.component.css'
})
export class CurrentGamesCardComponent {
  @Input() currentGame: any;
}
