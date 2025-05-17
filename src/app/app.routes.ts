import { Routes } from '@angular/router';
import {UsersListComponent} from './pages/users-list/users-list.component';
import {UserDetailsComponent} from './pages/user-details/user-details.component';
import {UserFormComponent} from './pages/user-form/user-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/users' },
  {path: 'users', component: UsersListComponent},
  {path: 'users/:id', component: UserDetailsComponent},
  {path: 'users/:id/edit', component: UserFormComponent},
  {path: 'users/new', component: UserFormComponent},
];
