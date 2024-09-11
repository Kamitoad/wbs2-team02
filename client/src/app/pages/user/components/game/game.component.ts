import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { BoardComponent } from './board/board.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: true,
  imports: [PlayerComponent, BoardComponent]
})
export class GameComponent implements OnInit {
  currentPlayer: 'X' | 'O' = 'X';  // Startspieler
  gameOver: boolean = false;
  board: ('X' | 'O' | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];  // 3x3 Spielbrett
  gameId: number = 1;  // Beispiel-GameId; sollte dynamisch bezogen werden

  constructor(private gameService: GameService) {}

  ngOnInit() {
    // Spielstatus beim Start laden
    this.loadGameState();

    // WebSocket-Ereignisse für Züge empfangen
    this.gameService.moveSubject.subscribe(move => {
      this.updateBoard(move.row, move.col, move.player);
      this.switchPlayer();
    });
  }

  // Lädt den aktuellen Spielstatus
  loadGameState() {
    this.gameService.getGameState(this.gameId).subscribe(gameState => {
      if (gameState && gameState.board) {
        this.board = gameState.board;
        this.currentPlayer = gameState.currentPlayer;
        this.gameOver = gameState.gameOver;
      }
    });
  }

  // Führt einen Zug aus
  makeMove(rowIndex: number, colIndex: number): void {
    if (!this.board[rowIndex][colIndex] && !this.gameOver) {
      this.gameService.makeMove(rowIndex, colIndex).subscribe(() => {
        this.updateBoard(rowIndex, colIndex, this.currentPlayer);
        this.switchPlayer();
      });
      this.gameService.emitMove(rowIndex, colIndex);  // Zug über WebSocket senden
    }
  }

  // Aktualisiert das Spielfeld
  updateBoard(row: number, col: number, player: 'X' | 'O') {
    this.board[row][col] = player;
  }

  // Wechselt den Spieler
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  // Spiel neu starten
  startNewGame() {
    this.gameOver = false;
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    this.currentPlayer = 'X';
  }
}
