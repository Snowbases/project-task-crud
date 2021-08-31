import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import { Login } from '../../interfaces/api/login.interface';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  data: Login = {
    email: '',
    password: ''
  }

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Email is invalid' },
      { type: 'valid', message: '' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'valid', message: '' }
    ]
  }

  loginForm: FormGroup;

  constructor(
    public alertController: AlertController,
    public navController: NavController,
    public toastController: ToastController,
    public apiService: ApiService,
    public utilityService: UtilityService,
    public authenticationService: AuthenticationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern(new RegExp(/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}\s*$/)),
        ]),
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      })
    });
  }

  ngOnInit() {
  }

  async login() {
    const loading = await this.utilityService.loadingController.create({
      spinner: null,
      cssClass: 'loading-circular',
      mode: 'ios',
      message: '<ion-img class="spinner" src="/assets/icon/spinner.svg" alt=""></ion-img><div class="loading-content sc-ion-loading-ios">Logging in...</div>',
    });
    await loading.present();

    this.authenticationService
      .login(this.data)
      .subscribe(
        async (response) => {
          console.log('login response', response);
          await loading.dismiss();

          try {
            await this.navController.navigateRoot('/project', {
              animationDirection: 'forward'
            });
          } catch (error) {
            console.log('navigateRoot error', error);
          }

        },
        async (error) => {
          console.log('login error', error);
          await loading.dismiss();

          if (error?.error?.error != undefined) {
            if (error?.error?.error == "Unauthorized") {
              await this.utilityService.showToastOnce({
                message: 'Email or password is not correct.',
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
              });
            }
          }

        }
      )
  }
}
