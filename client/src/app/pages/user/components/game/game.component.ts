import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../../services/game.service';
import {PlayerComponent} from './player/player.component';
import {BoardComponent} from './board/board.component';

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
  playerId!: number;
  currentPlayer: 'X' | 'O' = 'X';  // Startspieler
  gameOver: boolean = false;
  board: ('X' | 'O' | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];  // 3x3 Spielfeld

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadGameId();
    this.loadUser();
    this.loadGameFromLocalStorage();
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

  // Beitritt zum Spiel
  private joinGame(): void {
    if (this.gameId && this.user) {
      this.gameService.joinGame(this.gameId, this.user.userId);

      // Spiel-Daten im LocalStorage speichern
      const gameData = {
        gameId: this.gameId,
        currentPlayerId: this.user.userId,
        player1UserId: this.user.userId,
        player2UserId: this.opponent?.userId // Stelle sicher, dass Gegnerdaten verfügbar sind
      };
      localStorage.setItem('gameData', JSON.stringify(gameData));

      console.log('Game data saved in localStorage:', gameData);
    }
  }

  // Lade Spiel-Daten aus LocalStorage
  private loadGameFromLocalStorage(): void {
    const savedGame = localStorage.getItem('gameData');
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      this.gameId = gameData.gameId;
      this.user = { userId: gameData.currentPlayerId };
      this.opponent = { userId: gameData.player2UserId };
      console.log('Game data loaded from localStorage:', gameData);
    } else {
      console.log('No game data found in localStorage.');
    }
  }

  // WebSocket-Listener einrichten
  private setupWebSocketListeners(): void {
    this.gameService.moveSubject.subscribe(move => {
      console.log('Move received from WebSocket:', move);
      this.updateBoard(move.row, move.col, move.player);
      this.switchPlayer();
    });

    this.gameService.gameDataSubject.subscribe(gameData => {
      console.log('Game data received:', gameData);

      // Gegnerdaten prüfen
      if (gameData.players) {
        const opponentData = gameData.players.find((player: any) => player.userId !== this.user.userId);
        if (opponentData) {
          this.opponent = opponentData;
          console.log('Opponent in GameComponent:', this.opponent);
        } else {
          console.error('Opponent data not found');
        }
      }

      // Spiel-Daten in LocalStorage speichern
      const savedGameData = {
        gameId: this.gameId,
        currentPlayerId: this.user.userId,
        player1UserId: this.user.userId,
        player2UserId: this.opponent?.userId ?? 'Gegner unbekannt'
      };

      localStorage.setItem('gameData', JSON.stringify(savedGameData));
      console.log('Game data saved in localStorage:', savedGameData);
    });

    this.gameService.winnerSubject.subscribe(winnerData => {
      console.log(`Winner: ${winnerData.winner}`);
      this.gameOver = true;  // Spiel als beendet markieren
    });
  }

  // Einen Zug ausführen und über WebSocket senden
  makeMove(rowIndex: number, colIndex: number): void {
    if (!this.board[rowIndex][colIndex] && !this.gameOver) {
      this.updateBoard(rowIndex, colIndex, this.currentPlayer);
      this.switchPlayer();
      this.gameService.emitMove(this.gameId, rowIndex, colIndex, this.playerId);  // Zug über WebSocket senden
    } else {
      console.log('Ungültiger Zug oder Spiel ist beendet.');
    }
  }

  // Aktualisiere das Spielfeld
  updateBoard(row: number, col: number, player: 'X' | 'O'): void {
    this.board[row][col] = player;
  }

  // Spieler wechseln
  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  // Neues Spiel starten
  startNewGame(): void {
    this.gameOver = false;
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    this.currentPlayer = 'X';
  }
}
