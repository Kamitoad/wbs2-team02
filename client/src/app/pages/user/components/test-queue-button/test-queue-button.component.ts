import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {QueueService} from "../../services/queue.service";

@Component({
  selector: 'app-test-queue-button',
  standalone: true,
  imports: [],
  templateUrl: './test-queue-button.component.html',
  styleUrl: './test-queue-button.component.css'
})
export class TestQueueButtonComponent {

  statusMessage: string = "";

  constructor(private queueService: QueueService, private router: Router) {}

  joinQueue() {
    this.queueService.initiateSocketConnection();

    this.queueService.emitJoinQueue()
      .then(() => {
        // Navigation nur wenn kein Fehler aufgetreten ist
        this.router.navigate(['/queue']);
      })
      .catch((error) => {
        this.statusMessage = error.message;
        console.error('Error detected:', error);
      });
  }
}
