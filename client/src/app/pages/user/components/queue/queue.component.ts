import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {QueueService} from "../../services/queue.service";
import {AsyncPipe} from "@angular/common";
import {TimeCodePipe} from "../../../../shared/pipes/time-code.pipe";

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    TimeCodePipe
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent {
  user: any | null = null;
  opponent: any | null = null;
  waitingTime: number = 0;
  startCountdown: number = 3;
  gameStatus: string | null = null;  // Neue Variable für den Spielstatus

  constructor(
    public queueService: QueueService,
    private router: Router) {
    const savedUser = localStorage.getItem('user');
    this.user = savedUser ? JSON.parse(savedUser) : null;
  }

  ngOnInit(): void {
    this.queueService.opponent$.subscribe((opponent: any) => {
      this.opponent = opponent;
    });

    // Abonniere den neuen Observable für den Spielstatus
    this.queueService.gameStatus$.subscribe((status: string | null) => {
      this.gameStatus = status;
      console.log(this.gameStatus);
      console.log(status);
      if (status) {
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            this.startCountdown -= 1
          }, (i + 1) * 1000)
        }

        setTimeout(() => {
          this.router.navigate(['/game/3']);
        },3000)
      }
      console.log(this.gameStatus);
    });
    setInterval(() => {
      this.waitingTime += 1;
    }, 1000)
  }

  leaveQueue() {
    this.router.navigate(['/queuebutton']);
    this.queueService.leaveQueue().subscribe();
  }
}
