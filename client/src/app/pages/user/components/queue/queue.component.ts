import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router, RouterLink} from "@angular/router";
import {QueueService} from "../../services/queue.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {TimeCodePipe} from "../../../../shared/pipes/time-code.pipe";
import {ProfilePicComponent} from "../profile-pic/profile-pic.component";
import {ProfileService} from "../../services/profile.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    TimeCodePipe,
    ProfilePicComponent,
    NgIf
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent implements OnDestroy, OnInit {
  private routerSubscription: Subscription | null = null;

  user: any | null = null;
  opponent: any | null = null;
  waitingTime: number = 0;
  startCountdown: number = 3;
  gameStatus: string | null = null;
  gameId: number | null = null;

  constructor(
    public queueService: QueueService,
    private router: Router,
    private profileService: ProfileService,
  ) {
    const savedUser = localStorage.getItem('user');
    this.user = savedUser ? JSON.parse(savedUser) : null;
  }

  ngOnInit(): void {

    window.addEventListener('beforeunload', this.onUnloadHandler);

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!this.gameStatus) {
          this.leaveQueue();
        }
      }
    });

    this.profileService.getCurrentUser().subscribe({
      next: (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        this.queueService.checkIfInGame().subscribe({
          next: (res) => {
            console.log(res)
            if (res.ok) {
              this.joinQueue();

            } else {
              this.router.navigate(['profile']);
            }
          },
          error: () => {
          }
        });
      },
      error: () => {
        this.router.navigate(['login']);
      }
    });

    this.queueService.opponent$.subscribe((opponent: any) => {
      this.opponent = opponent;
      if (opponent?.gameId) {
        this.gameId = opponent.gameId;
        localStorage.setItem('opponent', JSON.stringify(opponent));
      }
    });

    this.queueService.gameStatus$.subscribe((status: string | null) => {
      this.gameStatus = status;

      if (status) {
        let countdownInterval = setInterval(() => {
          this.startCountdown -= 1;
          if (this.startCountdown <= 0) {
            clearInterval(countdownInterval);
            this.router.navigate([`/game/${this.gameId}`]);
          }
        }, 1000);
      }
    });

    setInterval(() => {
      this.waitingTime += 1;
    }, 1000)
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.onUnloadHandler);

    if (!this.gameStatus) {
      this.leaveQueue();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  joinQueue() {
    this.queueService.initiateSocketConnection();
    this.queueService.emitJoinQueue()
      .then(() => {
      })
      .catch((error) => {
        console.error('Error detected:', error);
        this.router.navigate(['/profile']);
      });
  }

  leaveQueue(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queueService.leaveQueue().subscribe({
        next: () => {
          this.router.navigate(['/profile']);
          resolve();
        },
        error: (err) => {
          console.error('Fehler beim Verlassen der Queue:', err);
          this.router.navigate(['/profile']);
          reject(err);
        }
      });
    });
  }

  onUnloadHandler = (event: BeforeUnloadEvent) => {
    if (!this.gameStatus) {
      this.leaveQueue();
    }
  };
}
