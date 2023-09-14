import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AuthenticationModule } from './authentication/authentication.module';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserGuard } from './guards/user.guard';
import { inject } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // Redirect empty path to 'home'
    pathMatch: 'full', // Use 'full' to match the complete path
  },
  {
    path: 'home',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: 'auth',
    loadChildren: () => AuthenticationModule,
    canActivate: [() => inject(UserGuard).canActivate()],
  },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
