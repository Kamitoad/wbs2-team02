import { Component, Input, OnChanges } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true
})
export class PlayerComponent implements OnChanges {
  @Input() username: string = 'Default User';
  @Input() symbol: 'X' | 'O' = 'X';
  @Input() elo: number = 1000;

  ngOnChanges(): void {
    console.log('PlayerComponent Inputs:', { username: this.username, symbol: this.symbol, elo: this.elo });
  }

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    // Überprüfe, ob die Daten korrekt geladen sind
    console.log('PlayerComponent initialized with:', this.username, this.symbol, this.elo);
  }
}
