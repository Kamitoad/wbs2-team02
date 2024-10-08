import {Component, Input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {TimeCodePipe} from "../../../../../../shared/pipes/time-code.pipe";
import {ProfilePicComponent} from "../../../../../user/components/profile-pic/profile-pic.component";

@Component({
  selector: 'app-queue-overview-card',
  standalone: true,
  imports: [
    DatePipe,
    TimeCodePipe,
    ProfilePicComponent
  ],
  templateUrl: './queue-overview-card.component.html',
  styleUrl: './queue-overview-card.component.css'
})
export class QueueOverviewCardComponent {
  @Input() userInQueue: any;
}
