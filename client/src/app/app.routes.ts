import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/user/components/login/login.component";
import {RegisterComponent} from "./pages/user/components/register/register.component";
import {UserdataComponent} from "./pages/admin/components/userdata/userdata.component";
import {CurrentGamesComponent} from "./pages/admin/components/gamedata/current-games/current-games.component";
import {GamedataComponent} from "./pages/admin/components/gamedata/gamedata.component";
import {QueueOverviewComponent} from "./pages/admin/components/gamedata/queue-overview/queue-overview.component";
import {TestQueueButtonComponent} from "./pages/user/components/test-queue-button/test-queue-button.component";
import {QueueComponent} from "./pages/user/components/queue/queue.component";
import {GameComponent} from "./pages/user/components/game/game.component";

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'queuebutton', component: TestQueueButtonComponent },
  { path: 'queue', component: QueueComponent },
  { path: 'game', component: GameComponent },

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
];
