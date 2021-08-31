import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(
    private authenticationService: AuthenticationService,
    private navController: NavController
  ) { }

  canLoad(): Observable<boolean> {
    return this.authenticationService.isAuthenticated.pipe(
      filter(value => value !== null),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          try {
            this.navController.navigateRoot('/project', {
              animationDirection: 'forward'
            });
          } catch (error) {
            console.log('navigateRoot error', error);
          }
        } else {
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}