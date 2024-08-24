import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-userdata-card',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './userdata-card.component.html',
  styleUrl: './userdata-card.component.css'
})
export class UserdataCardComponent {

}
