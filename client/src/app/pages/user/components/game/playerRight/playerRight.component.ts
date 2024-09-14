import { Component, Input } from "@angular/core";
import {ProfilePicComponent} from "../../profile-pic/profile-pic.component";

@Component({
  selector: 'app-playerRight',
  templateUrl: './playerRight.component.html',
  styleUrls: ['./playerRight.component.css'],
  imports: [
    ProfilePicComponent
  ],
  standalone: true
})

export class PlayerRightComponent {
  @Input() username!: string;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() symbol!: 'X' | 'O';
  @Input() currentPlayerId: number | null = null;
  @Input() user: any;
  @Input() opponent: any;
}
