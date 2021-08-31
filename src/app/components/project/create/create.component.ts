import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController, ToastOptions } from '@ionic/angular';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
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

  projectManagerList: { key: number; value: any; }[] = [];

  constructor(
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

  ionViewWillEnter() {
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

  async create() {
    console.log('create');

    this.apiService.storeProject(this.data).then(async (response: any) => {
      console.log('storeProject response', response);

      const toastOptions: ToastOptions = {
        message: 'Successfully create project.',
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
      console.log('storeProject error', error);

      const toastOptions: ToastOptions = {
        message: 'Failed to create project. Please try again.',
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
