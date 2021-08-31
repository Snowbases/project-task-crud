import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import { Login } from '../../interfaces/api/login.interface';
import { Storage } from "@ionic/storage";
import { UtilityService } from '../utility/utility.service';
import { ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  auth: { access_token: string };

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    private utilityService: UtilityService
  ) {
    this.loadAuth();
  }

  async loadAuth() {
    const auth = await this.storage.get('auth');
    if (auth && auth.access_token) {
      this.auth = auth;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(data: Login): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient
      .post(`${environment.url}/auth/login`, data, { headers })
      .pipe(
        map((data: { access_token: string }) => data),
        switchMap(data => {
          return from(
            this.storage.set('auth', data)
          );
        }),
        tap(_ => {
          this.isAuthenticated.next(true);
        }),
        catchError(async (error) => {
          if (error?.status == 0) {
            const toastOptions: ToastOptions = {
              message: 'Connection failed. Please try again.',
              cssClass: 'toast-error',
              duration: 3000,
              position: 'bottom',
              mode: 'md',
              enterAnimation: ToastEnterAnimation,
              leaveAnimation: ToastLeaveAnimation,
              buttons: [
                {
                  icon: 'assets/icon/close-toast.svg',
                  side: 'end',
                  role: 'cancel',
                  cssClass: 'toast-button-icon',
                }
              ]
            }
            await this.utilityService.showToastOnce(toastOptions);

            throw error;
          } else {
            throw error;
          }
        })
      );
  }

  async logout(): Promise<any> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post(`${environment.url}/auth/logout`, {}, { headers })
      .pipe(
        map((data: { message: string }) => data),
        switchMap((data: { message: string }) => {
          if (data?.message != undefined) {
            return from(this.storage.remove('auth'));
          }
        }),
        tap(_ => {
          this.isAuthenticated.next(false);
        }),
        catchError(async (error) => {
          if (error?.status == 0) {
            const toastOptions: ToastOptions = {
              message: 'Connection failed. Please try again.',
              cssClass: 'toast-error',
              duration: 3000,
              position: 'bottom',
              mode: 'md',
              enterAnimation: ToastEnterAnimation,
              leaveAnimation: ToastLeaveAnimation,
              buttons: [
                {
                  icon: 'assets/icon/close-toast.svg',
                  side: 'end',
                  role: 'cancel',
                  cssClass: 'toast-button-icon',
                }
              ]
            }
            await this.utilityService.showToastOnce(toastOptions);

            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }
}
