import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isGameFinished: boolean = false;
  @Input() resultMessage: 'WIN' | 'LOSS' | 'DRAW' | string = '';  // Statt 'result'

  @Output() newGame = new EventEmitter<void>();
  @Output() end = new EventEmitter<void>();

  constructor(private router: Router) {}

  startNewGame() {
    localStorage.setItem('opponent', "");

    this.router.navigate(['/queue']); // Navigiere zur Queue-Komponente

  }

  endGame() {
    this.router.navigate(['/profile']); // Navigiere zur Profilseite
  }
  open(): void {
    this.isGameFinished = true;
    // TODO EVENTUELL METHODE ZIM ÖFFNEN
  }
}
