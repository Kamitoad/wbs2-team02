import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {UserdataCardComponent} from "../userdata/userdata-card/userdata-card.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-gamedata',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    UserdataCardComponent,
    RouterOutlet,
    NgClass,
    RouterLinkActive
  ],
  templateUrl: './gamedata.component.html',
  styleUrl: './gamedata.component.css'
})
export class GamedataComponent {

}
