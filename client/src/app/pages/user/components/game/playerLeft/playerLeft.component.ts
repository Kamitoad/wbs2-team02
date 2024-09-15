import { Component, Input } from "@angular/core";
import {ProfilePicComponent} from "../../profile-pic/profile-pic.component";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";

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
  @Input() username!: string;
  @Input() userId!: number;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() symbol!: 'X' | 'O';
  @Input() user: any;
  @Input() currentPlayerId: number | null = null;

  get isReady(): boolean {
    return !!this.username && !!this.symbol && !!this.profilePic;
  }

}
