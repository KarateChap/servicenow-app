import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _uid = new BehaviorSubject<any>(null);
  currentUser: any;
  username = '';

  constructor(private fireAuth: Auth, private apiService: ApiService, private ticketService: TicketService) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );
      if (response?.user) {
        this.setUserData(response.user.uid);
      }
    } catch (e) {
      throw e;
    }
  }

  getId() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    return this.currentUser?.uid;
  }

  setUserData(uid) {
    this._uid.next(uid);
  }

  async register(formValue) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(
        this.fireAuth,
        formValue.email,
        formValue.password
      );
      const data = {
        email: formValue.email,
        username: formValue.username,
        uid: registeredUser.user.uid
      };
      await this.apiService.setDocument(
        `users/${registeredUser.user.uid}`,
        data
      );
      const userData = {
        id: registeredUser.user.uid,
      };
      return userData;
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch(e) {
      throw(e);
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      this._uid.next(null);
      this.currentUser = null;
      this.ticketService.userId = '';
      return true;
    } catch(e) {
      throw(e);
    }
  }

  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, user => {
        resolve(user)
      });
    });
  }


  async getUserData(id) {
    const docSnap: any = await this.apiService.getDocById(`users/${id}`);
      if(docSnap?.exists()) {
        this.username = docSnap.data().username;
        return docSnap.data();
      } else {
        throw('No such document exists');
      }
  }
}


