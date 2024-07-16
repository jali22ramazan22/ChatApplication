import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'chats',
        loadComponent: () => import('./chats/chats.component')
          .then(m => m.ChatsComponent)
      },
      {
        path: 'auth',
        loadComponent: () => import('./auth/auth.component')
          .then(m => m.AuthComponent),
        loadChildren: () => import('./auth/auth.routes')
          .then(m => m.authRoutes)
      }
    ]
  }

];
