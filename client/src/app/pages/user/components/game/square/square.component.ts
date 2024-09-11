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
    this.squareClick.emit();
  }

}
/* import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
  standalone: true
})
export class SquareComponent {
  @Input() value: string = '';
  @Output() click = new EventEmitter<void>();

  handleClick() {
    this.click.emit();
  }
}
*/