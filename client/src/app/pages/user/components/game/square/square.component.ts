import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
  standalone: true,
})

export class SquareComponent {
  @Input() value!: 'X' | 'O' | null;
  @Output() squareClick = new EventEmitter<void>();

  onClick() {
    console.log(`Square clicked: Current value = ${this.value}`);
    if (!this.value) {
      this.squareClick.emit();
    }
  }
}
