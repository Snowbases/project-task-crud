import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController, ToastOptions } from '@ionic/angular';
import * as qs from 'querystring';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { ApiService } from '../../../services/api/api.service';
import * as moment from "moment";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  data: any = {
    project_id: '',
    title: '',
    description: '',
    assigned_to_user_id: '',
    due_date: '',
    status: 'To Do'
  }

  validation_messages = {
    project_id: [
      { type: 'required', message: 'Project ID is required' },
      { type: 'valid', message: '' }
    ],
    title: [
      { type: 'required', message: 'Title is required' },
      { type: 'valid', message: '' }
    ],
    description: [
      { type: 'valid', message: '' }
    ],
    assigned_to_user_id: [
      { type: 'required', message: 'Assigned to is required' },
      { type: 'valid', message: '' }
    ],
    due_date: [
      { type: 'valid', message: '' }
    ],
    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'valid', message: '' }
    ]
  }

  taskForm: FormGroup;
  toast: HTMLIonToastElement;

  usersList: { key: number; value: any; }[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    public navController: NavController,
    public apiService: ApiService
  ) {
    this.taskForm = new FormGroup({
      project_id: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      title: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      description: new FormControl('', {
        validators: Validators.compose([
        ]),
        updateOn: 'change'
      }),
      assigned_to_user_id: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      due_date: new FormControl('', {
        validators: Validators.compose([
        ]),
        updateOn: 'change'
      }),
      status: new FormControl('', {
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
      this.usersList = result;

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

  async update() {
    console.log('update', this.data);

    const data = {
      ...this.data,
      assigned_to: this.data.assigned_to_user_id,
      due_date: moment(this.data.due_date).format('YYYY-MM-DD') || ''
    }
    console.log('data', data);

    this.apiService.updateTask(data).then(async (response: any) => {
      console.log('updateTask response', response);

      const toastOptions: ToastOptions = {
        message: 'Successfully update task.',
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
        await this.navController.navigateBack('/task', {
          animationDirection: 'back'
        });
      } catch (error) {
        console.log('navigateBack error', error);
      }

    }).catch((error) => {
      console.log('updateTask error', error);

      const toastOptions: ToastOptions = {
        message: 'Failed to update task. Please try again.',
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
