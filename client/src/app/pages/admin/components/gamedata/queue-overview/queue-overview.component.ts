import { Component } from '@angular/core';
import {CurrentGamesCardComponent} from "../current-games/current-games-card/current-games-card.component";
import {QueueOverviewCardComponent} from "./queue-overview-card/queue-overview-card.component";

@Component({
  selector: 'app-queue-overview',
  standalone: true,
  imports: [
    CurrentGamesCardComponent,
    QueueOverviewCardComponent
  ],
  templateUrl: './queue-overview.component.html',
  styleUrl: './queue-overview.component.css'
})
export class QueueOverviewComponent {

}
