import { Component, Input } from "@angular/core";
import {ProfilePicComponent} from "../../profile-pic/profile-pic.component";

@Component({
    selector: 'app-playerLeft',
    templateUrl: './playerLeft.component.html',
    styleUrls: ['./playerLeft.component.css'],
    imports: [
        ProfilePicComponent
    ],
    standalone: true
})

export class PlayerLeftComponent {
  @Input() username!: string;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() symbol!: 'X' | 'O';
  @Input() user: any;
  @Input() currentPlayerId: number | null = null;

  get isReady(): boolean {
    return !!this.username && !!this.symbol && !!this.profilePic;
  }

}

/*
import {Component, Input} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-playerLeft',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './playerLeft.component.html',
  styleUrl: './playerLeft.component.css'
})
export class PlayerLeftComponent {
  @Input() playerName: string = '';
  @Input() playerScore: number = 0;
  @Input() playerIcon: 'X' | 'O' = 'X';
  @Input() isCurrentPlayer: boolean = false;
}
*/
