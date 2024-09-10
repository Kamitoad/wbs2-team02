import { Component, Input, Output, EventEmitter } from '@angular/core';

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
