import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

interface Player {
  name: string;
  elo: number;
}

interface Move {
  row: number;
  col: number;
  player: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  imports: [
    CommonModule,
    FaIconComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  board: string[][] = Array.from({ length: 3 }, () => Array(3).fill(''));
  currentPlayer: string = 'X';
  player1: Player = { name: 'Spieler 1', elo: 1200 };
  player2: Player = { name: 'Spieler 2', elo: 1250 };

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.connectToGame(1);
    this.gameService.moveReceived$.subscribe((move) => {
      this.receiveMove(move);
    });
  }

  makeMove(row: number, col: number): void {
    if (!this.board[row][col]) {
      const move = { row, col, player: this.currentPlayer, gameId: 1 }; // Ensure gameId is correct
      this.gameService.sendMove(move);
      this.board[row][col] = this.currentPlayer;
      this.switchPlayer();
    } else {
      console.error(`Das Feld (${row}, ${col}) ist bereits besetzt.`);
    }
  }

  receiveMove(move: Move): void {
    this.board[move.row][move.col] = move.player;
  }

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  protected readonly faUser = faUser;
}
