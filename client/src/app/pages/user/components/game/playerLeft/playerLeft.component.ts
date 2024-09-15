import {Component, Input} from "@angular/core";
import {ProfilePicComponent} from "../../profile-pic/profile-pic.component";
import {AsyncPipe, formatCurrency, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-playerLeft',
  templateUrl: './playerLeft.component.html',
  styleUrls: ['./playerLeft.component.css'],
  imports: [
    ProfilePicComponent,
    AsyncPipe,
    NgIf,
    NgClass
  ],
  standalone: true
})

export class PlayerLeftComponent {
  /*
  @Input() userName!: string;
  @Input() userId!: number;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() playerSymbol!: 'X' | 'O'; // Symbol des aktuellen Spielers
  @Input() user: any; // Typ kann angepasst werden, falls nötig
  @Input() currentPlayerId: number | null = null; // Optional, falls nötig

  // Prüfen, ob alle notwendigen Daten geladen wurden
  get isReady(): boolean {
    return !!this.userName && !!this.profilePic && !!this.playerSymbol;
  }
   */
  @Input() user: any;

  protected readonly formatCurrency = formatCurrency;
}
