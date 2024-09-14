import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../../services/game.service';
import {PlayerLeftComponent} from './playerLeft/playerLeft.component';
import {BoardComponent} from './board/board.component';
import {ProfileService} from "../../services/profile.service";
import {PlayerRightComponent} from "./playerRight/playerRight.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: true,
  imports: [
    PlayerLeftComponent,
    BoardComponent,
    PlayerRightComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  public profileService: ProfileService = inject(ProfileService);


  user: any = null;
  opponent: any = null;
  gameId!: number;
  currentPlayerId: number | null = null;
  currentPlayer: 'X' | 'O' = 'X';
  gameOver: boolean = false;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.profileService.getCurrentUser().subscribe({
      next: () => {
        // TODO EVENTUELL this.joinGame() in das next und andere
      },
      error: () => {
        this.router.navigate(['login']);
      }
    });
    this.loadGameId();
    this.loadUser();
    this.joinGame();
    this.setupWebSocketListeners();
  }

  // Lade die gameId aus den Routenparametern
  private loadGameId(): void {
    this.route.paramMap.subscribe(params => {
      this.gameId = Number(params.get('gameId'));
    });
  }

  ngOnDestroy() {
    this.gameService.resign(this.gameId, this.user.userId);


  }

  // Lade Benutzerinformationen aus LocalStorage
  private loadUser(): void {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      console.error('Benutzerinformationen nicht gefunden');
      return;
    }
    this.user = JSON.parse(savedUser);
  }

  // Beitritt zum Spiel
  private joinGame(): void {
    if (this.gameId && this.user) {
      this.gameService.joinGame(this.gameId, this.user.userId);

      this.gameService.joinedGameSubject.subscribe((data) => {
        this.currentPlayerId = data.game.currentPlayer;

        // Spiel-Daten im LocalStorage speichern
        const gameData = {
          gameId: this.gameId,
          currentPlayerId: this.currentPlayerId,
          player1UserId: data.game.player1.userId,
          player2UserId: data.game.player2.userId
        };
        localStorage.setItem('gameData', JSON.stringify(data));

        const savedGameData = localStorage.getItem('gameData');
        if (!savedGameData) {
          console.error('Spielinformationen nicht gefunden');
          return;
        }
        // Player 1 of Game is 'X', Player 2 is 'O'
        gameData.player1UserId == this.user.userId ? this.user.symbol = 'X' : this.user.symbol = 'O'
      });
    }
  }

  // WebSocket-Listener einrichten
  private setupWebSocketListeners(): void {

    this.gameService.joinedGameSubject.subscribe(gameData => {
      const opponentString = localStorage.getItem('opponent');

      if (!opponentString) {
        console.error('Opponent not found in localStorage.');
        return;
      }

      //TODO: Read opponent-data correctly in HTML
      const opponent = JSON.parse(opponentString);

      if (!opponent) {
        console.error('Opponent not found in localStorage.');
        return;
      }

      this.opponent = opponent;
      /*
      // Gegnerdaten prüfen
      if (gameData.player1) {
        const opponentData = gameData.players.find((playerLeft: any) => playerLeft.userId !== this.user.userId);
        if (opponentData) {
          this.opponent = opponentData;
        } else {
          console.error('Opponent data not found');
        }
      }
      */

      // Spiel-Daten in LocalStorage speichern
      const savedGameData = {
        gameId: this.gameId,
        currentPlayerId: this.gameService.joinedGame$,
        player1UserId: this.user.userId,
        player2UserId: this.opponent?.userId ?? 'Gegner unbekannt'
      };

      localStorage.setItem('gameData', JSON.stringify(gameData));
    });

    this.gameService.winnerSubject.subscribe(winnerData => {
      console.log(`Winner: ${winnerData.winner}`);
      this.gameOver = true;
    });
  }

// Spieler wechseln
  // Todo -> Prüfen ob currentplayer richtig übergeben wird
  switchPlayer(): void {
    // Spielerwechsel basierend auf dem aktuellen Spieler
    this.currentPlayerId = this.currentPlayerId === this.user.userId ? this.opponent.userId : this.user.userId;

    // Aktualisiere localStorage
    const gameData = JSON.parse(localStorage.getItem('gameData')!);
    gameData.currentPlayerId = this.currentPlayerId;
    localStorage.setItem('gameData', JSON.stringify(gameData));

    console.log('Neuer aktueller Spieler:', this.currentPlayerId);
  }


  /*
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
  */
}
