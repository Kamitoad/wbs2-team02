import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

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
}
