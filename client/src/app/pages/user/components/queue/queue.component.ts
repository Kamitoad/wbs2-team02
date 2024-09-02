import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../../shared/services/auth/auth.service";
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
  constructor(
    private authService: AuthService,
    private queueService: QueueService,
    private router: Router) {}

  leaveQueue() {
    this.router.navigate(['/queuebutton']);
    this.queueService.leaveQueue().subscribe(
      response => console.log('Response:', response),
      error => console.error('Error:', error)
    );
  }
}
