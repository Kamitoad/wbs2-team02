import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true
})

export class PlayerComponent {
  @Input() username!: string;
  @Input() symbol!: 'X' | 'O';
  @Input() elo!: number;
}

/*
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  @Input() playerName!: string;
  @Input() playerScore!: number;
  @Input() playerIcon!: string;
  @Input() isCurrentPlayer!: boolean;
}
*/