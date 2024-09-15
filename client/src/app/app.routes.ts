import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/user/components/login/login.component";
import {RegisterComponent} from "./pages/user/components/register/register.component";
import {ProfileComponent} from "./pages/user/components/profile/profile.component";
import {UserdataComponent} from "./pages/admin/components/userdata/userdata.component";
import {CurrentGamesComponent} from "./pages/admin/components/gamedata/current-games/current-games.component";
import {GamedataComponent} from "./pages/admin/components/gamedata/gamedata.component";
import {QueueOverviewComponent} from "./pages/admin/components/gamedata/queue-overview/queue-overview.component";
import {QueueComponent} from "./pages/user/components/queue/queue.component";
import {TestComponent} from "./pages/user/components/test/test.component";

export const routes: Routes = [

  /*
    If the redirect-routes don't work:
    Replace this:
    { path: '', component: LoginComponent},
    with this:
    { path: '', redirectTo: 'login', pathMatch: 'full'},

    or vice versa

    I'm not sure if even god knows why...
  */


  {path:  'test', component: TestComponent},
  { path: 'login', component: LoginComponent},
  { path: '', component: LoginComponent},

  { path: 'register', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'profil', redirectTo: 'profile', pathMatch: 'full'},
  { path: 'queue', component: QueueComponent },

  { path: 'admin/user', component: UserdataComponent },
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

  { path: 'admin', redirectTo: 'admin/user', pathMatch: 'full' },

  { path: '**', redirectTo: 'login', pathMatch: 'full'},
];
