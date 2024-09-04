import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {QueueService} from "../../services/queue.service";

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent {
  user: any | null = null;

  constructor(
    private queueService: QueueService,
    private router: Router)
  {
    const savedUser = localStorage.getItem('user');
    this.user = savedUser ? JSON.parse(savedUser) : null;
  }

  leaveQueue() {
    this.router.navigate(['/queuebutton']);
    this.queueService.leaveQueue().subscribe(
      response => console.log('Response:', response),
      error => console.error('Error:', error)
    );
  }
}
