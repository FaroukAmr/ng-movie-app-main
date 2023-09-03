import { User as FirebaseUser, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private auth: AngularFireAuth) {}

  user$ = this.auth.authState;

  async updateProfile(username: string) {
    try {
      const loggedInUser = await this.auth.currentUser;
      await updateProfile(loggedInUser as FirebaseUser, {
        displayName: username,
      });
    } catch (error) {
      throw error;
    }
  }

  async registerUser(user: User) {
    try {
      await this.auth.createUserWithEmailAndPassword(user.email, user.password);
    } catch (error) {
      throw error;
    }
  }

  signInUser(user: User): Observable<any> {
    return from(
      this.auth.signInWithEmailAndPassword(user.email, user.password)
    );
  }

  signOutUser(): Observable<any> {
    return from(this.auth.signOut());
  }
}
