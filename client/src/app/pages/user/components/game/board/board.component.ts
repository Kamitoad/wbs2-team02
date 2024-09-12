import {Component, Input, OnInit} from "@angular/core";
import {GameService} from "../../../services/game.service";
import {SquareComponent} from "../square/square.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  imports: [
    SquareComponent
  ],
  standalone: true
})
export class BoardComponent implements OnInit {
  board: ('X' | 'O' | null)[][] = Array(3).fill(null).map(() => Array(3).fill(null));
  currentPlayer: 'X' | 'O' = 'X';

  @Input() gameId!: number; // Die `gameId` wird über den Input von der übergeordneten Komponente erhalten
  @Input() userId!: number; // Füge userId hinzu, um den aktuellen Spieler zu identifizieren

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    // Hören auf Zug-Updates, die über WebSocket empfangen werden
    this.gameService.moveSubject.subscribe(data => {
      this.updateBoard(data.row, data.col, data.player);
    });
  }

  makeMove(rowIndex: number, colIndex: number) {
    // Stelle sicher, dass das Feld leer ist und der aktuelle Spieler an der Reihe ist
    if (!this.board[rowIndex][colIndex] && this.gameService.currentPlayer?.isTurn) {
      // Hier wird das Spielfeld aktualisiert
      this.updateBoard(rowIndex, colIndex, this.gameService.currentPlayer.symbol);

      // Sende den Zug an den Server
      this.gameService.emitMove(this.gameId, rowIndex, colIndex, this.userId);

      // Spieler wechseln
      this.switchPlayer();
    }
  }


  /*
    makeMove(rowIndex: number, colIndex: number) {
      if (!this.board[rowIndex][colIndex]) {
        this.updateBoard(rowIndex, colIndex, this.currentPlayer);
        this.switchPlayer();
        // Sende den Zug über WebSocket
        this.gameService.emitMove(this.gameId, rowIndex, colIndex, this.userId);
      }
    }
  */
  updateBoard(row: number, col: number, player: 'X' | 'O') {
    if (row >= 0 && row < this.board.length && col >= 0 && col < this.board[row].length) {
      if (!this.board[row][col]) {
        console.log(`Updating board: Player ${player} at Row: ${row}, Col: ${col}`);
        this.board[row][col] = player;
        console.log('Board state:', this.board);
      } else {
        console.log('This position is already taken.');
      }
    } else {
      console.log('Invalid row or column.');
    }
  }


  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }
}


/*
import { Component, Input, OnInit } from "@angular/core";
import { SquareComponent } from "../square/square.component";
import { GameService } from "../../../services/game.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  standalone: true,
  imports: [SquareComponent]
})

export class BoardComponent implements OnInit {
  board: ('X' | 'O' | null)[][] = Array(3).fill(null).map(() => Array(3).fill(null));  // Das Spielfeld
  currentPlayer: 'X' | 'O' = 'X';  // Der aktuelle Spieler

  @Input() gameId!: number;  // Die `gameId` wird über den Input von der übergeordneten Komponente erhalten

  constructor(private gameService: GameService) {}

  ngOnInit() {
    // Hören auf Zug-Updates, die über WebSocket empfangen werden
    this.gameService.moveSubject.subscribe(data => {
      this.updateBoard(data.row, data.col, data.player);
    });
  }

  // Führt einen Zug aus und sendet ihn an den Server
  makeMove(rowIndex: number, colIndex: number) {
    if (!this.board[rowIndex][colIndex]) {
      console.log(`Player ${this.currentPlayer} makes move at Row: ${rowIndex}, Col: ${colIndex}`);
      this.gameService.makeMove(rowIndex, colIndex).subscribe(() => {
        this.updateBoard(rowIndex, colIndex, this.currentPlayer);
        this.switchPlayer();
        console.log(`Board after move: `, this.board);
        // Sende den Zug über WebSocket
        this.gameService.emitMove(rowIndex, colIndex);
      });
    }
  }

// Im updateBoard() zum Debuggen der Spielfeld-Aktualisierung
  updateBoard(row: number, col: number, player: 'X' | 'O') {
    this.board[row][col] = player;
    console.log(`Board updated: Player ${player} at Row: ${row}, Col: ${col}`, this.board);
  }

  // Wechselt den aktuellen Spieler
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }
}
*/
