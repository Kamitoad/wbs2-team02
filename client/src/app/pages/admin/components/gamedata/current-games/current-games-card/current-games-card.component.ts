import {Component, Input} from '@angular/core';
import {ProfilePicComponent} from "../../../../../user/components/profile-pic/profile-pic.component";

@Component({
  selector: 'app-current-games-card',
  standalone: true,
  imports: [
    ProfilePicComponent
  ],
  templateUrl: './current-games-card.component.html',
  styleUrl: './current-games-card.component.css'
})
export class CurrentGamesCardComponent {
  @Input() currentGame: any;
}
