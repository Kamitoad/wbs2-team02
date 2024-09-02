import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service'; // Pfad anpassen
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameBoard: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  moveCount: number = 0;
  gameId: number = 0;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGameUpdates().subscribe((updatedGame) => {
      this.updateGameBoard(updatedGame);
    });

    this.gameService.getGameCreated().subscribe((newGame) => {
      console.log('New game created:', newGame);
    });
  }

  makeMove(row: number, col: number): void {
    if (this.gameBoard[row][col] !== '' || this.winner) {
      return;
    }

    this.gameBoard[row][col] = this.currentPlayer;
    this.moveCount++;

    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
      window.alert(`Spieler ${this.currentPlayer} hat gewonnen!`);
    } else if (this.moveCount === 9) {
      this.winner = 'Unentschieden';
      window.alert('Das Spiel ist unentschieden!');
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    // Send the move to the server
// Angenommene Methode, die `gameId` als `number` erwartet
    this.gameService.makeMove(this.gameId, { field: `${row}-${col}`, value: this.currentPlayer });
  }

  updateGameBoard(updatedGame: any) {
    // Update the game board and state based on the received game data
    console.log('Game board updated:', updatedGame);
    // Replace with actual logic
  }

  checkWinner(): boolean {
    for (let i = 0; i < 3; i++) {
      if (this.gameBoard[i][0] && this.gameBoard[i][0] === this.gameBoard[i][1] && this.gameBoard[i][1] === this.gameBoard[i][2]) {
        return true;
      }
      if (this.gameBoard[0][i] && this.gameBoard[0][i] === this.gameBoard[1][i] && this.gameBoard[1][i] === this.gameBoard[2][i]) {
        return true;
      }
    }

    if (this.gameBoard[0][0] && this.gameBoard[0][0] === this.gameBoard[1][1] && this.gameBoard[1][1] === this.gameBoard[2][2]) {
      return true;
    }
    if (this.gameBoard[0][2] && this.gameBoard[0][2] === this.gameBoard[1][1] && this.gameBoard[1][1] === this.gameBoard[2][0]) {
      return true;
    }

    return false;
  }

  resetGame(): void {
    this.gameBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    this.currentPlayer = 'X';
    this.winner = null;
    this.moveCount = 0;
  }

  protected readonly faUser = faUser;
}
