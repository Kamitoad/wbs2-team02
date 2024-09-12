import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { PlayerComponent } from './player/player.component';
import { BoardComponent } from './board/board.component';

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
  user: any = null;
  opponent: any = null;
  gameId!: number;
  userTurn: boolean = false;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadGameId();
    this.loadUser();
    this.setupOpponent();
    this.joinGame();
    this.setupWebSocketListeners();
  }

  // Lade die gameId aus den Routenparametern
  private loadGameId(): void {
    this.route.paramMap.subscribe(params => {
      this.gameId = Number(params.get('gameId'));
    });
  }

  // Lade Benutzerinformationen aus LocalStorage
  private loadUser(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.user.symbol = this.user.symbol || 'X';  // Fallback für Symbol
    } else {
      console.error('Benutzerinformationen nicht gefunden');
    }
    console.log('User in GameComponent:', this.user);
  }

  // Simuliere einen Gegner (oder lade Gegnerdaten über eine API)
  private setupOpponent(): void {
    this.opponent = {
      userName: 'Gegner',
      symbol: 'O',
      elo: 1500
    };
    console.log('Opponent in GameComponent:', this.opponent);
  }

  // Beitritt zum Spiel
  private joinGame(): void {
    if (this.gameId && this.user) {
      this.gameService.joinGame(this.gameId, this.user.userId);
    }
  }

  // WebSocket-Listener einrichten
  private setupWebSocketListeners(): void {
    this.gameService.moveSubject.subscribe(move => {
      console.log('Move received from WebSocket:', move);
    });

    this.gameService.winnerSubject.subscribe(winnerData => {
      console.log(`Winner: ${winnerData.winner}`);
    });
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
