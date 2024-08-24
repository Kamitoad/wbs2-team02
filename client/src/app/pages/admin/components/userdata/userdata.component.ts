import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserdataCardComponent} from "./userdata-card/userdata-card.component";

@Component({
  selector: 'app-userdata',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserdataCardComponent
  ],
  templateUrl: './userdata.component.html',
  styleUrl: './userdata.component.css'
})
export class UserdataComponent {

}
