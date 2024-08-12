import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  imports: [
    NgForOf,
    FaIconComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  gameBoard: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  moveCount: number = 0;

  // Method for a move
  makeMove(row: number, col: number): void {
    // If the field is already occupied or the game is over, do nothing
    if (this.gameBoard[row][col] !== '' || this.winner) {
      return;
    }

    // Place the current player's symbol on the board
    this.gameBoard[row][col] = this.currentPlayer;
    this.moveCount++;

     // Check if someone won
    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
      // Display a notification that the player has won
      window.alert(`Spieler ${this.currentPlayer} hat gewonnen!`);
    } else if (this.moveCount === 9) {
      // If the board is full and no one has won, the game is a draw
      this.winner = 'Unentschieden';
      window.alert('Das Spiel ist unentschieden!');
    } else {
// Switch to the next player
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  // Method to check game status
  checkWinner(): boolean {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      if (this.gameBoard[i][0] && this.gameBoard[i][0] === this.gameBoard[i][1] && this.gameBoard[i][1] === this.gameBoard[i][2]) {
        return true;
      }
      if (this.gameBoard[0][i] && this.gameBoard[0][i] === this.gameBoard[1][i] && this.gameBoard[1][i] === this.gameBoard[2][i]) {
        return true;
      }
    }

    // check diagonals
    if (this.gameBoard[0][0] && this.gameBoard[0][0] === this.gameBoard[1][1] && this.gameBoard[1][1] === this.gameBoard[2][2]) {
      return true;
    }
    if (this.gameBoard[0][2] && this.gameBoard[0][2] === this.gameBoard[1][1] && this.gameBoard[1][1] === this.gameBoard[2][0]) {
      return true;
    }

    // no winner
    return false;
  }

// Method to reset the game
  resetGame(): void {
    this.gameBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    this.currentPlayer = 'X';
    this.winner = null;
    this.moveCount = 0;
  }

  protected readonly faUser = faUser;
}
