import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/user/components/login/login.component";
import {RegisterComponent} from "./pages/user/components/register/register.component";
import {UserdataComponent} from "./pages/admin/components/userdata/userdata.component";
import {CurrentGamesComponent} from "./pages/admin/components/gamedata/current-games/current-games.component";
import {GamedataComponent} from "./pages/admin/components/gamedata/gamedata.component";
import {QueueOverviewComponent} from "./pages/admin/components/gamedata/queue-overview/queue-overview.component";
import {EditPasswordProfilepicComponent} from "./pages/user/components/editUser/edit-password-profilpic/edit-password-profilepic.component";

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/editUser', component: UserdataComponent },
  {path: 'editPassword', component: EditPasswordProfilepicComponent },
  { path: 'admin/game', component: GamedataComponent,
    children: [
      {
        path: 'currentgames', component: CurrentGamesComponent,
      },
      {
        path: 'queue', component: QueueOverviewComponent,
      },
    ]
  },
];
