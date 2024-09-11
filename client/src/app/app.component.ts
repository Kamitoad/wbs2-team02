import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './pages/user/components/register/register.component';
import { ProfileComponent } from './pages/user/components/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent,ProfileComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
}

// Define the User class outside the Angular module
export class User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;

  constructor(firstName: string, lastName: string, username: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
  }
}
