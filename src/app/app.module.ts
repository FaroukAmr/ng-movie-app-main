import * as firebase from 'firebase/app';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

firebase.initializeApp(environment.firebase);
@NgModule({
  declarations: [AppComponent, NavbarComponent, HomeComponent, MovieDetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [],

  bootstrap: [AppComponent],
})
export class AppModule {}
