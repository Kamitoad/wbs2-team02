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

  constructor(private queueService: QueueService, private router: Router) {}

  joinQueue() {
    this.router.navigate(['/queue']);
    this.queueService.joinQueue().subscribe(
      response => console.log('Response:', response),
      error => console.error('Error:', error)
    );
  }
}
