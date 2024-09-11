import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ProfilePicComponent} from "../../../../user/components/profile-pic/profile-pic.component";

@Component({
  selector: 'app-userdata-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ProfilePicComponent
  ],
  templateUrl: './userdata-card.component.html',
  styleUrl: './userdata-card.component.css'
})
export class UserdataCardComponent {
  @Input() user: any;
}
