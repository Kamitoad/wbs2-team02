import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isGameFinished: boolean = false;
  @Input() resultMessage: 'WIN' | 'LOSS' | 'DRAW' | string = '';  // statt 'result'

  @Output() newGame = new EventEmitter<void>();
  @Output() end = new EventEmitter<void>();


  constructor(private router: Router) {
  }
  startNewGame() {
 //   this.newGame.emit();
    this.router.navigate(['/queue']); // Navigate to the queue component
  }

  endGame() {
    // this.end.emit();
    this.router.navigate(['/profile']); // Navigate to the profile page
  }


  isVisible: boolean = false;

  open(): void {

    this.isVisible = true;
  }
}
