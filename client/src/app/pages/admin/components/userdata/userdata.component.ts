import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserdataCardComponent} from "./userdata-card/userdata-card.component";
import {Router, RouterLink} from "@angular/router";
import {UserdataService} from "../../services/userdata.service";
import {ProfileService} from "../../../user/services/profile.service";

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

  constructor(
    private userdataService: UserdataService,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    /*
    const savedUser: string = localStorage.getItem('user') ?? '';
    if (!savedUser) {
      this.router.navigate(['login']);
    }
    const savedUserJson = JSON.parse(savedUser);

    if (savedUserJson.role !== "admin") {
      this.router.navigate(['/profile']);
    }
    */

    this.profileService.getCurrentUser().subscribe({
      next: (res) => {
        if (res.role !== "admin") {
          this.router.navigate(['/profile']);
        }
      },
      error: () => {
        this.router.navigate(['login']);
      }
    });

    this.userdataService.users$.subscribe((users: any[]) => {
      this.users = users;
    });
  }
}
