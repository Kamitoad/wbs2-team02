import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true
})

export class PlayerComponent {
  @Input() username!: string;
  @Input() elo!: number;
  @Input() profilePic!: string;
  @Input() symbol!: 'X' | 'O';
}

/*
import {Component, Input} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  @Input() playerName: string = '';
  @Input() playerScore: number = 0;
  @Input() playerIcon: 'X' | 'O' = 'X';
  @Input() isCurrentPlayer: boolean = false;
}
*/
