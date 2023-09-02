import { User as FirebaseUser, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private auth: AngularFireAuth) {}

  user$ = this.auth.authState;

  private async updateProfileAndReturnUser(
    FireBaseUser: FirebaseUser,
    user: User
  ): Promise<FirebaseUser> {
    try {
      await updateProfile(FireBaseUser, {
        displayName: user.username,
      });
      return FireBaseUser;
    } catch (error) {
      throw error;
    }
  }

  registerUser(user: User): Observable<any> {
    return from(
      this.auth.createUserWithEmailAndPassword(user.email, user.password)
    ).pipe(
      tap((credential) => {
        const userData = credential.user as FirebaseUser;
        this.updateProfileAndReturnUser(userData, user);
      })
    );
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
