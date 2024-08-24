import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";
import {UserdataCardComponent} from "../userdata/userdata-card/userdata-card.component";

@Component({
  selector: 'app-gamedata',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    UserdataCardComponent,
    RouterOutlet
  ],
  templateUrl: './gamedata.component.html',
  styleUrl: './gamedata.component.css'
})
export class GamedataComponent {

}
