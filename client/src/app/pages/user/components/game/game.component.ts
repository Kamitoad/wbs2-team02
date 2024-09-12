import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { PlayerComponent } from './player/player.component';
import { BoardComponent } from './board/board.component';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: true,
  imports: [
    PlayerComponent,
    BoardComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  user: any;
  opponent: any;
  userId!: number;
  gameId!: number;
  currentPlayer: 'X' | 'O' = 'X';  // oder ein dynamischer Wert, der deinen aktuellen Spieler repräsentiert

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Hole die gameId aus den Routenparametern
    this.route.paramMap.subscribe(params => {
      this.gameId = Number(params.get('gameId'));
    });

    // Hole die userId aus dem LocalStorage
    const savedUser = localStorage.getItem('user');
    this.userId = savedUser ? JSON.parse(savedUser).userId : null;

    if (this.gameId && this.userId) {
      // User tritt dem Spiel bei
      this.gameService.joinGame(this.gameId, this.userId);
    }

    // Abonniere die Spielzüge
    this.gameService.moveSubject.subscribe(move => {
      console.log('Move received from WebSocket:', move);
    });

    // Abonniere die Gewinner-Daten
    this.gameService.winnerSubject.subscribe(winnerData => {
      console.log(`Winner: ${winnerData.winner}`);
    });

    // WebSocket-Verbindung einrichten
    this.gameService.setupSocketListeners();
  }
}


// Mögliche spätere Methode zum Setzen eines Spielzugs
  /*
  makeMove(x: number, y: number) {
    const move = { playerId: this.userId, x, y };
    this.gameService.emitMove(this.gameId, move);
  }
  */

/*
import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { BoardComponent } from './board/board.component';
import { GameService } from '../../services/game.service';
import {Router} from "@angular/router";

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
  gameId: number | null = null;
  user: any | null = null;
  gameStatus: string | null = null;

  constructor(private gameService: GameService, private router: Router) {
    const savedUser = localStorage.getItem('user');
    this.user = savedUser ? JSON.parse(savedUser) : null;
  }

  ngOnInit(): void {
    // Setup WebSocket-Verbindung
    this.gameService.setupWebSocketConnection();
    this.gameService.setupSocketListeners();

    // WebSocket-Ereignisse für Züge empfangen
    this.gameService.moveSubject.subscribe(move => {
      this.updateBoard(move.row, move.col, move.player);
      this.switchPlayer();
    });
  }

  // Führt einen Zug aus und sendet ihn über WebSocket
  makeMove(rowIndex: number, colIndex: number): void {
    if (!this.board[rowIndex][colIndex] && !this.gameOver) {
      this.updateBoard(rowIndex, colIndex, this.currentPlayer); // Lokale Aktualisierung des Boards
      this.switchPlayer();
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

/*
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
 */
