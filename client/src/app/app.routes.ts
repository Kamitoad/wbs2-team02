import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/user/components/login/login.component";
import {RegisterComponent} from "./pages/user/components/register/register.component";

export const routes: Routes = [

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},

];
