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
  currentPlayer: 'X' | 'O' = 'X';
  gameOver: boolean = false;
  opponentSymbol: any;

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
        // TODO EVENTUELL this.joinGame() in das next und andere
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

  ngAfterViewInit() {
    if (!this.modal) {
      console.error('Modal-Instanz wurde nicht gefunden');
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

      this.gameService.gameDataSubject.subscribe((data) => {

        this.currentPlayerId = data.currentPlayer;


        // Spiel-Daten im LocalStorage speichern
        const gameData = {
          gameId: this.gameId,
          currentPlayerId: this.currentPlayerId,
          player1UserId: data.player1.userId,
          player2UserId: data.player2.userId
        };
        localStorage.setItem('gameData', JSON.stringify(data));

        const savedGameData = localStorage.getItem('gameData');
        if (!savedGameData) {
          console.error('Spielinformationen nicht gefunden');
          return;
        }
        // Player 1 of Game is 'X', Player 2 is 'O'

        gameData.player1UserId == this.user.userId ? this.user.symbol = 'X' : this.user.symbol = 'O';

        if (this.user.symbol == 'O') {
          this.opponentSymbol = 'X';
        } else {
          this.opponentSymbol = 'O';
        }

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

      const opponent = JSON.parse(opponentString);

      if (!opponent) {
        console.error('Opponent data is null or undefined.');
        return;
      }

      this.opponent = opponent;
    });

    setTimeout(() => {

      // Weitere WebSocket-Listener
      this.gameService.winnerSubject.subscribe(winnerData => {
        ;
        this.gameOver = true;
        // MODAL
        this.isGameFinished = true;



        if (winnerData == null) {
          this.resultMessage = 'Es ist ein Unentschieden';
        } else if (winnerData != this.user.userId) {
          this.resultMessage = 'Du hast gewonnen';
        } else {
          this.resultMessage = 'Du hast verloren';
        }

        this.showGameOverModal();
      });
    }, 500);


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
  showGameOverModal(): void {
    if (this.modal) {
      this.modal.open(); // Modal-Fenster öffnen
    } else {
    }
  }



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

