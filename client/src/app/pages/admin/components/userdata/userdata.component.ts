import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserdataCardComponent} from "./userdata-card/userdata-card.component";
import {RouterLink} from "@angular/router";
import {UserdataService} from "../../services/userdata.service";

@Component({
  selector: 'app-userdata',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserdataCardComponent,
    RouterLink
  ],
  templateUrl: './userdata.component.html',
  styleUrl: './userdata.component.css'
})
export class UserdataComponent {
  users: any = [];

  constructor(private userdataService: UserdataService) {}

  ngOnInit(): void {
    this.userdataService.users$.subscribe((users: any[]) => {
      this.users = users;
    });
  }
}
