import { Component } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { BoardComponent } from './board/board.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: true,
  imports: [PlayerComponent, BoardComponent, ]  // Weitere Komponenten und Module später hier importieren
})
export class GameComponent {
  // Spielstatus, Spielerinformationen
  currentPlayer: 'X' | 'O' = 'X';  // Startspieler
  gameOver: boolean = false;

  constructor(gameservice:GameService ){}
}



/**

import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from "./player/player.component";
import { BoardComponent } from "./board/board.component";
import { ModalComponent } from "./modal/modal.component";
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: true,
  imports: [
    PlayerComponent,
    BoardComponent,
    ModalComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  parsedGame: any = null;
  player1Name: string | null = null;
  player1Score: number | null = null;
  player1Icon: string | null = null;
  player2Name: string | null = null;
  player2Score: number | null = null;
  player2Icon: string | null = null;
  isPlayer1Turn: boolean = true;

  gameBoard: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  gameFinished: boolean = false;
  gameResult: 'WIN' | 'LOSS' | 'DRAW' | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    // Lade die Daten aus der DB oder dem localStorage
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
      const parsedGame = JSON.parse(savedGame);
      this.player1Name = parsedGame.player1Name;
      this.player1Score = parsedGame.player1Score;
      this.player1Icon = parsedGame.player1Icon;
      this.player2Name = parsedGame.player2Name;
      this.player2Score = parsedGame.player2Score;
      this.player2Icon = parsedGame.player2Icon;
      this.gameBoard = parsedGame.gameBoard;
      this.gameResult = parsedGame.gameResult;
      this.isPlayer1Turn = parsedGame.isPlayer1Turn;
    }

    // Subscribe to game state changes from GameService (if needed)
    this.gameService.currentGameState$.subscribe(gameState => {
      this.gameBoard = gameState.board;
      this.isPlayer1Turn = gameState.isPlayer1Turn;
    });

    this.gameService.error$.subscribe(errorMessage => {
      if (errorMessage) {
        console.error('Game Error:', errorMessage);
      }
    });
  }

  // Beende das Spiel und setze das Ergebnis
  endGame(result: 'WIN' | 'LOSS' | 'DRAW') {
    this.gameFinished = true;
    this.gameResult = result;
  }

  // Starte ein neues Spiel, indem das Brett zurückgesetzt wird
  startNewGame() {
    this.gameFinished = false;
    this.gameResult = null;
    this.gameBoard = [['', '', ''], ['', '', ''], ['', '', '']];  // Setze das Brett zurück
    this.isPlayer1Turn = true;  // Spieler 1 beginnt
  }

  // Spiel beenden und zum Hauptbildschirm zurückkehren
  quitGame() {
    // Logik, um das Spiel zu verlassen und zum Hauptbildschirm zu wechseln
  }
}

 */