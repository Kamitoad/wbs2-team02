import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-playerRight',
  templateUrl: './playerRight.component.html',
  styleUrls: ['./playerRight.component.css'],
  standalone: true
})

export class PlayerRightComponent {
  @Input() username!: string;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() symbol!: 'X' | 'O';

  @Input() user: any;  // Benutzerdaten aus game.component.ts
  @Input() currentPlayerId: number | null = null;


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
