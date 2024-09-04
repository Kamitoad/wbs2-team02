import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {QueueService} from "../../services/queue.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent {
  user: any | null = null;
  opponent: any | null = null;

  constructor(
    public queueService: QueueService,
    private router: Router)
  {
    const savedUser = localStorage.getItem('user');
    this.user = savedUser ? JSON.parse(savedUser) : null;
  }

  ngOnInit(): void {
    this.queueService.opponent$.subscribe((opponent: any) => {
      this.opponent = opponent;
    });
  }

  leaveQueue() {
    this.router.navigate(['/queuebutton']);
    this.queueService.leaveQueue().subscribe();
  }
}
