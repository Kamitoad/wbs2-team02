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
  @Input() userName!: string;
  @Input() userId!: number;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() symbol!: 'X' | 'O';
  @Input() currentPlayerId: number | null = null;
  @Input() opponent: any | null = null;
  @Input() gameId: number | null = null;
}
