import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  startNewGame() {
    this.newGame.emit();
    // TODO this.router navgiate auf Queue
  }

  endGame() {
    this.end.emit();
    // TODO this.router navgiate auf Profil
  }
}
