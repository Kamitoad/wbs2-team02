import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {QueueService} from "../../services/queue.service";

@Component({
  selector: 'app-queue-button',
  standalone: true,
  imports: [],
  templateUrl: './queue-button.component.html',
  styleUrl: './queue-button.component.css'
})
export class QueueButtonComponent {

  statusMessage: string = "";

  constructor(private queueService: QueueService, private router: Router) {}

  joinQueue() {
    this.queueService.initiateSocketConnection();

    this.queueService.emitJoinQueue()
      .then(() => {
        this.router.navigate(['/queue']);
      })
      .catch((error) => {
        this.statusMessage = error.message;
        console.error('Error detected:', error);
      });
  }
}
