import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule} from './layout/layout.module';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import {SharedModule} from './core/modules/shared/shared.module';
import {LoginGuard} from './core/guards/login.guard';
import {AuthGuard} from './core/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    // RegisterComponent,
    // LoginComponent,
    // HomeComponent,
    // EditProfileComponent,
    // ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    LayoutModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
