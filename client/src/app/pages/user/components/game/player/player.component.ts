import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true
})

export class PlayerComponent {
  @Input() username!: string;
  @Input() symbol!: 'X' | 'O';
  @Input() elo!: number;

  // Optional: Dynamisches Handling falls kein ELO gesetzt ist
  get hasElo(): boolean {
    return !!this.elo;
  }
}
