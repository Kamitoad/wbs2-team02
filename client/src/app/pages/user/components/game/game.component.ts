import {Component, OnInit} from '@angular/core';
import {GameService} from '../../services/game.service'; // Pfad anpassen
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

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
    FaIconComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  player1: Player = {name: 'Spieler 1', elo: 1200};
  player2: Player = {name: 'Spieler 2', elo: 1250};
  currentPlayer: string = 'X';

  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    const gameId = 1; // Beispielhafte Game-ID
    this.gameService.connectToGame(gameId);
  }

  // This method is called when a move is made.
  makeMove(row: number, col: number): void {
    if(!this.board[row][col]) {
      // Update local playing field
      this.board[row][col] = this.currentPlayer;

      // send WebSocket-train
      const move: Move = { row, col, player: this.currentPlayer}; // pass the current player dynamically
      this.gameService.sendMove(move);

      // change player
      this.switchPlayer();
    }
  }

// This method changes the player after each turn
switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  // updates the game based on the state received from the server
  updateGameState(gameState: any) {
    this.board = gameState.board;
    this.currentPlayer = gameState.currentPlayer;
  }

  // Receives a move from the server and updates the board.
  receiveMove(data: Move): void {
  }

  protected readonly faUser = faUser;
}
