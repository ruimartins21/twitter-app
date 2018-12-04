import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {LoginGuard} from './core/guards/login.guard';
import {AuthGuard} from './core/guards/auth.guard';

const routes: Routes = [
  // { path: '', component: HomeComponent },
  { path: '',
    // component: ProfileComponent
    loadChildren: './pages/home/home.module#HomeModule',
    // canActivate: [AuthGuard]
  },
  { path: 'login',
    // component: ProfileComponent
    loadChildren: './pages/auth/login/login.module#LoginModule',
    canActivate: [LoginGuard]
  },
  { path: 'register',
    // component: ProfileComponent
    loadChildren: './pages/auth/register/register.module#RegisterModule',
    canActivate: [LoginGuard]
  },
  { path: 'profile',
    // component: ProfileComponent
    loadChildren: './pages/profile/profile.module#ProfileModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
