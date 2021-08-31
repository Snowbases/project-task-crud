import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController, ToastOptions } from '@ionic/angular';
import * as qs from 'querystring';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  data: any = {
    name: '',
    manager_id: '',
  }

  validation_messages = {
    project_name: [
      { type: 'required', message: 'Project Name is required' },
      { type: 'valid', message: '' }
    ],
    project_manager: [
      { type: 'required', message: 'Project Manager is required' },
      { type: 'valid', message: '' }
    ]
  }

  projectForm: FormGroup;

  toast: HTMLIonToastElement;

  projectManagerList: any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    public navController: NavController,
    public apiService: ApiService
  ) {
    this.projectForm = new FormGroup({
      project_name: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      project_manager: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      })
    });
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(async (result: any) => {
      console.log('activatedRoute queryParams result', result);
      if (result?.data != null && result?.data != undefined && result?.data != '') {
        this.data = JSON.parse(JSON.stringify(qs.parse(result?.data)));
      }
    }, error => {
      console.log('activatedRoute queryParams error', error);
    });

    this.apiService.getAllUsers().then((response: {}) => {
      console.log('getAllUsers response', response);

      // https://stackoverflow.com/questions/38824349/how-to-convert-an-object-to-an-array-of-key-value-pairs-in-javascript
      const result = Object.keys(response).map((key) => ({ 'key': Number(key), 'value': response[key] }));
      this.projectManagerList = result;

    }).catch((error) => {
      console.log('getAllUsers error', error);

      const toastOptions: ToastOptions = {
        message: 'Failed to get project manager list. Please try again.',
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
      this.showToastOnce(toastOptions);

    });
  }

  async showToastOnce(toastOptions: ToastOptions) {
    try {
      try {
        await this.toast.dismiss();
      } catch {
      }
      this.toast = await this.toastController.create(toastOptions);
      await this.toast.present();
    } catch (error) {
      console.log('toast create error', error);
    }
  }

  update() {
    console.log('update');

    this.apiService.updateProject(this.data).then(async (response: any) => {
      console.log('updateProject response', response);

      const toastOptions: ToastOptions = {
        message: 'Successfully update project.',
        cssClass: 'toast-success',
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
      this.showToastOnce(toastOptions);

      try {
        await this.navController.navigateBack('/project', {
          animationDirection: 'back'
        });
      } catch (error) {
        console.log('navigateBack error', error);
      }

    }).catch((error) => {
      console.log('updateProject error', error);

      const toastOptions: ToastOptions = {
        message: 'Failed to update project. Please try again.',
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
      this.showToastOnce(toastOptions);

    });
  }

}
