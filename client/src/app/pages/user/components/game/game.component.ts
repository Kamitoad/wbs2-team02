import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../../services/game.service';
import {PlayerLeftComponent} from './playerLeft/playerLeft.component';
import {BoardComponent} from './board/board.component';
import {ProfileService} from "../../services/profile.service";
import {Subscription} from "rxjs";
import {PlayerRightComponent} from "./playerRight/playerRight.component";
import {ModalComponent} from './modal/modal.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: true,
  imports: [
    PlayerLeftComponent,
    BoardComponent,
    PlayerRightComponent,
    ModalComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  public profileService: ProfileService = inject(ProfileService);
  private routerSubscription: Subscription | null = null;
  @ViewChild(ModalComponent) modal!: ModalComponent; // Import Modal Component

  user: any = null;
  opponent: any = null;
  gameId!: number;
  currentPlayerId: number | null = null;
  gameOver: boolean = false;

  // MODAL
  resultMessage: string = '';
  isGameFinished: boolean = false;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    /*
    window.addEventListener('beforeunload', this.onUnloadHandler);

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        //this.gameService.resign(this.gameId, this.user.userId);
      }
    });
    */
    this.loadGameId();
    this.profileService.getCurrentUser().subscribe({
      next: () => {
        this.gameService.getGame(this.gameId).subscribe({
          next: () => {
          },
          error: (err) => {
            console.log(err.error.message)
            this.router.navigate(['profile']);
          }
        })
      },
      error: () => {
        this.router.navigate(['login']);
      }
    });
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
    // window.removeEventListener('beforeunload', this.onUnloadHandler);
    // this.gameService.resign(this.gameId, this.user.userId);

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
        localStorage.setItem('gameData', JSON.stringify(gameData));
      })
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

      const opponent = JSON.parse(opponentString);

      if (!opponent) {
        console.error('Opponent data is null or undefined.');
        return;
      }

      this.opponent = opponent;
      console.log('AUSLESEN OPPONENT', this.opponent);
    });
    this.user.playerSymbol = 'X';
    this.opponent.playerSymbol = 'O';

    // Weitere WebSocket-Listener
    this.gameService.winnerSubject.subscribe(winnerData => {
      console.log(`Winner: ${winnerData.winner}`);
      this.gameOver = true;
      // MODAL
      this.isGameFinished = true;
      this.resultMessage = winnerData.winner === this.user.userId ? 'WIN' : 'LOSS';
      this.showGameOverModal(); // Modal-Fenster anzeigen, wenn das Spiel vorbei ist
    });

    // Listener für das Starten eines neuen Spiels
    this.modal.newGame.subscribe(() => {
      this.router.navigate(['/queue']);
    });

    // Listener für das Beenden des Spiels
    this.modal.end.subscribe(() => {
      this.router.navigate(['/profile']);
    });
  }

  // OPEN MODAL METHODE
  showGameOverModal()
    :
    void {
    if (this.modal
    ) {
      console.log('Modal wird geöffnet');
      this.modal.open(); // Modal-Fenster öffnen
    } else {
      console.error('Modal-Instanz nicht gefunden');
    }
  }


// Spieler wechseln
  // Todo -> Prüfen ob currentplayer richtig übergeben wird
  /*
  switchPlayer(): void {
    // Logge die aktuellen Spielerinformationen zur Überprüfung
    console.log("Aktueller Spieler vor dem Wechsel:", this.currentPlayerId);
    console.log('Benutzer-ID:', this.user?.userId);
    console.log('Gegner-ID:', this.opponent?.userId);

    // Überprüfe, ob user und opponent korrekt gesetzt sind
    if (!this.user || !this.opponent) {
      console.error('Spielerinformationen fehlen!');
      return;
    }

    // Spielerwechsel basierend auf dem aktuellen Spieler
    this.currentPlayerId = this.currentPlayerId === this.user.userId ? this.opponent.userId : this.user.userId;

    // Setze den aktuellen Spieler basierend auf der neuen currentPlayerId
    this.currentPlayer = this.currentPlayerId === this.user.userId ? 'X' : 'O'; // Beispielhafte Logik für 'X' und 'O'
    console.log('Neuer aktueller Spieler:', this.currentPlayer);

    // Aktualisiere localStorage
    const gameData = JSON.parse(localStorage.getItem('gameData')!);
    gameData.currentPlayerId = this.currentPlayerId;
    localStorage.setItem('gameData', JSON.stringify(gameData));

    // Konsolenausgabe nach dem Wechsel
    console.log('Neuer aktueller Spieler nach dem Wechsel:', this.currentPlayerId);
  }
*/


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

export interface User {
  userId: number;
  userName: string;
  email: string;
  profilePic?: string;
  elo: number;
  totalWins: number;
  totalTies: number;
  totalLosses: number;
}

