import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User } from '../user/user.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private isAuthenticated = false;
  private user: User;
  // private userId: string;
  // private userName: string;
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}
  createUser(
    email: string,
    password: string,
    userName: string,
    userNickname: string
  ) {
    const authData: AuthData = {
      email,
      password,
      userName,
      userNickname
    };
    this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      res => {
        console.log(res);
        this.login(email, password);
      },
      err => {
        this.isAuthenticated = false;
        this.isAuthenticated$.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        userName: string;
        userNickname: string;
        email: string;
      }>(BACKEND_URL + 'login', authData)
      .subscribe(
        res => {
          this.token = res.token;
          if (this.token) {
            this.user = {
              id: res.userId,
              name: res.userName,
              nickname: res.userNickname,
              email: res.email
            };
            // this.userId = res.userId;
            // this.userName = res.userName;
            this.setAuthTimer(res.expiresIn);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + res.expiresIn * 1000
            );
            this.saveAuthData(
              res.token,
              expirationDate,
              res.userId,
              res.userName,
              res.userNickname,
              res.email
            );
            this.isAuthenticated = true;
            this.isAuthenticated$.next(true);
            console.log(res);
            this.router.navigate(['/']);
          }
        },
        err => {
          this.isAuthenticated = false;
          this.isAuthenticated$.next(false);
        }
      );
  }

  getUserId(): string {
    return this.user.id;
  }

  getUserName(): string {
    return this.user.name;
  }

  getUser(): User {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  setAuthTimer(expiresIn) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000);
  }

  getAuthObs() {
    return this.isAuthenticated$.asObservable();
  }

  getAuthBool() {
    return this.isAuthenticated;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAuthenticated$.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (authData) {
      const now = new Date();
      const expiresIn = authData.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.setAuthTimer(expiresIn / 1000);
        this.token = authData.token;
        this.user = {
          id: authData.userId,
          name: authData.userName,
          nickname: authData.userNickname,
          email: authData.email
        };
        // this.userId = authData.userId;
        // this.userName = authData.userName;
        this.isAuthenticated = true;
        this.isAuthenticated$.next(true);
      }
    }
  }

  saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userName: string,
    userNickname: string,
    email: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userNickname', userNickname);
    localStorage.setItem('email', email);
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('email');
  }

  getAuthData(): {
    token: string;
    expirationDate: Date;
    userId: string;
    userName: string;
    userNickname: string;
    email: string;
  } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userNickname = localStorage.getItem('userNickname');
    const email = localStorage.getItem('email');
    if (!token || !expirationDate) {
      return;
    } else {
      return {
        token,
        expirationDate: new Date(expirationDate),
        userId,
        userName,
        userNickname,
        email
      };
    }
  }
}
