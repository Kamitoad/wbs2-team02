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
    console.log(this.board  )
  }

  makeMove(rowIndex: number, colIndex: number) {
    const gameDataString = localStorage.getItem('gameData');
    const userDataString = localStorage.getItem('user');

    console.log("Klick geschehen bei: ", rowIndex, ", ", colIndex);

    // Überprüfen, ob gameData im localStorage existiert
    if (!gameDataString) {
      console.error('Game data not found in localStorage.');
      return;
    }

    if (!userDataString) {
      console.error('User data not found in localStorage.');
      return;
    }
      const gameData = JSON.parse(gameDataString);
      const userData = JSON.parse(userDataString);

    this.gameService.gameDataSubject.subscribe((data) => {

      const mapValueToBoard = (value: number) => {
        if (value === 0) return null;
        return value === 1 ? 'X' : 'O';
      };

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const fieldKey = `field${row}_${col}`;
          this.board[row][col] = mapValueToBoard(data[fieldKey]);
        }
      }

      console.log(data)
    });
     this.gameService.emitMove(this.gameId, rowIndex, colIndex, userData.userId);
     //this.switchPlayer(); // Spieler nach dem Zug wechseln
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

  //TODO: Switch between status in HTML: "Your Turn" and "Opponents Turn"
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
