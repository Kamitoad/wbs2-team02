import { Component, Input } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  standalone: true,
  imports: [SquareComponent],
})
export class BoardComponent {
  @Input() board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  indices: number[] = Array.from({ length: 9 }, (_, i) => i);
  squares: string[] = Array(9).fill('');

    // Konstruktor, um GameService zu injizieren
    constructor(private gameService: GameService) {}

  async makeMove(index: number) {
    // Handle the square click logic here
    const row = Math.floor(index / 3);
    const col = index % 3;
    await this.gameService.makeMove('game-id-placeholder', row, col); // Setze hier die richtige Game-ID
    console.log('Square clicked at index:', index);
  }
}
