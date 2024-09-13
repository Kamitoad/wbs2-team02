import {Component, Input, OnInit} from "@angular/core";
import {GameService} from "../../../services/game.service";
import {SquareComponent} from "../square/square.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  imports: [
    SquareComponent, CommonModule
  ],
  standalone: true
})
export class BoardComponent implements OnInit {
  board: ('X' | 'O' | null)[][] = Array(3).fill(null).map(() => Array(3).fill(null)); // Standard Tic-Tac-Toe 3x3 Board
  currentPlayer: 'X' | 'O' = 'X'; // Aktueller Spieler

  @Input() gameId!: number; // Spiel-ID wird von der Elternkomponente übergeben
  @Input() userId!: number; // Benutzer-ID des aktuellen Spielers

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    // Auf Züge warten, die über den WebSocket empfangen werden
    this.gameService.moveSubject.subscribe(data => {
      this.updateBoard(data.row, data.col, data.player);
    });
  }

  makeMove(rowIndex: number, colIndex: number) {
    const gameDataString = localStorage.getItem('gameData');

    // Überprüfen, ob gameData im localStorage existiert
    if (gameDataString) {
      const gameData = JSON.parse(gameDataString);

      // Überprüfen, ob currentPlayerId vorhanden ist
      if (gameData.currentPlayerId === this.userId && !this.board[rowIndex][colIndex]) {
        const symbol = gameData.currentPlayerId === gameData.player1UserId ? 'X' : 'O';
        this.updateBoard(rowIndex, colIndex, symbol);
        this.gameService.emitMove(this.gameId, rowIndex, colIndex, this.userId);
        this.switchPlayer(); // Spieler nach dem Zug wechseln
      } else {
        console.log('Ungültiger Zug oder Spieler ist nicht am Zug.');
      }
    } else {
      console.error('Game data not found in localStorage.');
    }
  }




  // Aktualisiert das Spielfeld und validiert die Positionen
  updateBoard(row: number, col: number, player: 'X' | 'O') {
    if (this.isValidPosition(row, col) && !this.board[row][col]) {
      console.log(`Updating board: Player ${player} at Row: ${row}, Col: ${col}`);
      this.board[row][col] = player;
      console.log('Aktueller Spielfeldzustand:', this.board);
    } else {
      console.log('Ungültige Position oder das Feld ist bereits belegt.');
    }
  }

  // Prüft, ob die angegebene Position innerhalb des Spielfelds liegt
  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[row].length;
  }

  switchPlayer() {
    const gameData = JSON.parse(localStorage.getItem('gameData')!);

    if (gameData.currentPlayerId === gameData.player1UserId) {
      gameData.currentPlayerId = gameData.player2UserId;
    } else {
      gameData.currentPlayerId = gameData.player1UserId;
    }

    localStorage.setItem('gameData', JSON.stringify(gameData));

    this.currentPlayer = gameData.currentPlayerId === gameData.player1UserId ? 'X' : 'O';
  }

}

/*
import {Component, Input, OnInit} from "@angular/core";
import {GameService} from "../../../services/game.service";
import {SquareComponent} from "../square/square.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  imports: [
    SquareComponent, CommonModule
  ],
  standalone: true
})
export class BoardComponent implements OnInit {
  // board: ('X' | 'O' | null)[][] = Array(3).fill(null).map(() => Array(3).fill(null));
  board = [
    ['X', '', 'O'],
    ['', 'O', 'X'],
    ['O', 'X', '']
  ];
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
  */
/*
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
  */
/*
  makeMove(rowIndex: number, colIndex: number) {
    if (!this.board[rowIndex][colIndex] && this.gameService.currentPlayer?.isTurn) {
      this.updateBoard(rowIndex, colIndex, this.gameService.currentPlayer.symbol);
      this.gameService.emitMove(this.gameId, rowIndex, colIndex, this.userId);
      this.switchPlayer(); // Switch after the move
    }
  }
  */


/*
  makeMove(rowIndex: number, colIndex: number) {
    if (!this.board[rowIndex][colIndex]) {
      this.updateBoard(rowIndex, colIndex, this.currentPlayer);
      this.switchPlayer();
      // Sende den Zug über WebSocket
      this.gameService.emitMove(this.gameId, rowIndex, colIndex, this.userId);
    }
  }

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
*/

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
