import {Component, Input, OnInit, EventEmitter, Output} from "@angular/core";
import {GameService} from "../../../services/game.service";
import {SquareComponent} from "./square/square.component";
import {CommonModule} from "@angular/common";
import {GameComponent} from "../game.component";

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
  gamedata: any;
  board: ('X' | 'O' | null)[][] = Array(3).fill(null).map(() => Array(3).fill(null)); // Standard Tic-Tac-Toe 3x3 Board
  currentPlayer: 'X' | 'O' = 'X'; // Aktueller Spieler

  @Output() playerSwitched: EventEmitter<void> = new EventEmitter();

  @Input() gameId!: number; // Spiel-ID wird von der Elternkomponente übergeben
  @Input() userId!: number; // Benutzer-ID des aktuellen Spielers

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameService.initializeBoard(this.gameId);
    this.gameService.gameData$.subscribe((game: any) => {
      this.gamedata = game;
      this.putSymbolsInFields(this.gamedata);
    });
    this.setupWebSocketListeners()
  }

  ngOnDestroy() {
    //this.gameService.resign(this.gameId, this.userId)
  }

  setupWebSocketListeners(): void {
    this.gameService.moveSubject.subscribe((gameData: any) => {
      // Update the board based on the new gameData
      this.putSymbolsInFields(gameData);
    });


  }

  makeMove(rowIndex: number, colIndex: number): void {
    const gameDataString = localStorage.getItem('gameData');
    const userDataString = localStorage.getItem('user');

    // Überprüfen, ob gameData im localStorage existiert
    if (!gameDataString) {
      console.error('Game data not found in localStorage.');
      return;
    }

    if (!userDataString) {
      console.error('User data not found in localStorage.');
      return;
    }
    const userData = JSON.parse(userDataString);

    this.gameService.emitMove(this.gameId, rowIndex, colIndex, userData.userId);
    // this.switchPlayer(); // Spieler nach dem Zug wechseln

    // Spieler wechseln nach dem Zug
    this.playerSwitched.emit();

    this.gameService.gameDataSubject.subscribe((data) => {
      localStorage.setItem('gameData', JSON.stringify(data));

      this.putSymbolsInFields(data);
    });
  }

  putSymbolsInFields(data: any) {
    const mapValueToBoard = (value: number) => {
      if (value === 0 || value === null) return null;
      return value === 1 ? 'X' : 'O';
    };

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const fieldKey = `field${row}_${col}`;
        if (data[fieldKey] !== undefined) { // Überprüfen, ob das Feld existiert
          this.board[row][col] = mapValueToBoard(data[fieldKey]);
        }
      }
    }
  }

  // Prüft, ob die angegebene Position innerhalb des Spielfelds liegt
  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[row].length;
  }

  /*
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
  */

}
