import {Component, Input, Output, EventEmitter} from '@angular/core';
import {GameService} from '../../../services/game.service';  // Korrigiere den Pfad entsprechend

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  @Input() board: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];

  constructor(private gameService: GameService) {
  }

  makeMove(row: number, col: number) {
    if (this.board[row][col] === '') {
      this.board[row][col] = 'X';  // Beispiel: aktueller Spieler
      this.gameService.makeMove('gameId', row, col);  // Füge eine gameId ein
    }
  }
}
