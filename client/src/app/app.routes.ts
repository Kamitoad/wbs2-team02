import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/user/components/login/login.component";
import {RegisterComponent} from "./pages/user/components/register/register.component";
import {UserdataComponent} from "./pages/admin/components/userdata/userdata.component";

export const routes: Routes = [

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'admin/user', component: UserdataComponent},

];
