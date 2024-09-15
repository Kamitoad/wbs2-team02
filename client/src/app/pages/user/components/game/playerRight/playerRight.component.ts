import {Component, Input} from "@angular/core";
import {ProfilePicComponent} from "../../profile-pic/profile-pic.component";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-playerRight',
  templateUrl: './playerRight.component.html',
  styleUrls: ['./playerRight.component.css'],
  imports: [
    ProfilePicComponent,
    AsyncPipe,
    NgIf,
    NgClass
  ],
  standalone: true
})

export class PlayerRightComponent {
  /*
  @Input() userName!: string;
  @Input() userId!: number;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() opponentSymbol!: 'X' | 'O'; // Symbol des Gegners
  @Input() currentPlayerId: number | null = null; // Optional, falls nötig
  @Input() opponent: any | null = null; // Typ kann angepasst werden, falls nötig
  @Input() gameId: number | null = null; // Optional, falls nötig

  // Prüfen, ob alle notwendigen Daten geladen wurden
  get isReady(): boolean {
    return !!this.userName && !!this.profilePic && !!this.opponentSymbol;
  }
  */
  @Input() opponent: any;
}
