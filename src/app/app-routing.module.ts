import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './authentication/auth.guard';
import { AuthenticationModule } from './authentication/authentication.module';
import { HomeComponent } from './home/home.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserGuard } from './authentication/user.guard';
import { inject } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: 'auth',
    loadChildren: () => AuthenticationModule,
    canActivate: [() => inject(UserGuard).canActivate()],
  },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  {
    path: 'movie/:id',
    component: MovieDetailsComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
