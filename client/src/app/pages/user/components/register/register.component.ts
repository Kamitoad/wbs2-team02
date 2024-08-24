import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
  ],
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  confirmPassword: string = '';
  usernameTaken: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  httpclient: HttpClient = inject(HttpClient);

  onSubmit() {
    if (this.password !== this.confirmPassword || this.email !== this.confirmEmail) {
      return;
    }
    // Check if the username is already taken by calling the UserService
    this.userService.checkUsername(this.username).subscribe((isTaken: any) => {
      if (isTaken) {
        // If  username is taken show an error message
        this.usernameTaken = true;
      } else {
        // If username is available -> proceed to register
        this.userService.registerUser({
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        }).subscribe(() => {
          // successful registration -> navigate to  profile picture upload
          this.router.navigate(['/profile-picture']);
        });
      }
    });
  }
}
