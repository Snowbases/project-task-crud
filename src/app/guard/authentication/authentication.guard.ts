import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { filter, take, map } from 'rxjs/operators';
import { CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {

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
          return true;
        } else {
          try {
            this.navController.navigateRoot('/login', {
              animationDirection: 'forward'
            });
          } catch (error) {
            console.log('navigateRoot error', error);
          }
          return false;
        }
      })
    );
  }
}
