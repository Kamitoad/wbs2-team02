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
    this.router.navigate(['/queue']); // Navigiere zur Queue-Komponente
  }

  endGame() {
    this.router.navigate(['/profile']); // Navigiere zur Profilseite
  }

  // Funktion zum Öffnen des Modals (setzt die Sichtbarkeit)
  open(): void {
    this.isGameFinished = true;
  }

  // Funktion zum Schließen des Modals
  close(): void {
    this.isGameFinished = false;
  }
}
