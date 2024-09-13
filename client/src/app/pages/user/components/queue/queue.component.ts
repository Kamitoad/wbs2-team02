import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {QueueService} from "../../services/queue.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {TimeCodePipe} from "../../../../shared/pipes/time-code.pipe";
import {ProfilePicComponent} from "../profile-pic/profile-pic.component";
import {ProfileService} from "../../services/profile.service";

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

    this.profileService.getCurrentUser().subscribe({
      next: () => {
        this.queueService.checkIfInGame().subscribe({
          next: (res) => {
            if (res.ok) {
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
    this.leaveQueue();
  }

  joinQueue() {
    this.queueService.initiateSocketConnection();

    this.queueService.emitJoinQueue()
      .then(() => {
      })
      .catch((error) => {
        console.error('Error detected:', error);
      });
  }

  leaveQueue() {
    this.router.navigate(['/profile']);
    this.queueService.leaveQueue().subscribe();
  }
}
