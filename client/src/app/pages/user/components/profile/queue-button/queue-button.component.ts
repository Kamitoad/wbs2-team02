import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {QueueService} from "../../../services/queue.service";

@Component({
  selector: 'app-queue-button',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './queue-button.component.html',
  styleUrl: './queue-button.component.css'
})
export class QueueButtonComponent {
  statusMessage: string = "";

  constructor(
    private router: Router,
    public queueService: QueueService,
  ) {}


  tryJoinQueue() {
    this.queueService.checkIfInGame().subscribe({
      next: (res) => {
        if (res.ok) {
          this.router.navigate(['queue']);
        } else {
          this.statusMessage = res.message;
          this.removeErrorMessage();
        }
      },
      error: (err) => {
        this.statusMessage = err.error.message || 'Unbekannter Fehler';
        this.removeErrorMessage();
      }
    });
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.statusMessage = "";
    }, 5000);
  }
}
