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
