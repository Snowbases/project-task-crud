import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController, ToastOptions } from '@ionic/angular';
import * as qs from 'querystring';
import { TaskDatabase } from '../../../adapters/task.adapter';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { Task, TaskStatus } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  data: Task = {
    id: '',
    project_id: '',
    user: '',
    title: '',
    slug: '',
    description: '',
    due_date: '',
    status: TaskStatus.to_do
  }

  validation_messages = {
    id: [
      { type: 'required', message: 'ID is required' },
      { type: 'valid', message: '' }
    ],
    project_id: [
      { type: 'required', message: 'Project ID is required' },
      { type: 'valid', message: '' }
    ],
    user: [
      { type: 'required', message: 'User is required' },
      { type: 'valid', message: '' }
    ],
    title: [
      { type: 'required', message: 'Title is required' },
      { type: 'valid', message: '' }
    ],
    slug: [
      { type: 'required', message: 'Slug is required' },
      { type: 'valid', message: '' }
    ],
    description: [
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
  taskDatabase: TaskDatabase;
  toast: HTMLIonToastElement;
  status: TaskStatus;

  constructor(
    public activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    public navController: NavController
  ) {
    this.taskForm = new FormGroup({
      id: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      project_id: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      user: new FormControl('', {
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
      slug: new FormControl('', {
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
    // Instantiate it
    this.taskDatabase = new TaskDatabase();

    // Open it
    this.taskDatabase.open().catch(error => {
      console.error(`Open failed: ${error.stack}`);
    });

    this.activatedRoute.queryParams.subscribe(async (result: any) => {
      console.log('activatedRoute queryParams result', result);
      if (result?.data != null && result?.data != undefined && result?.data != '') {
        this.data = JSON.parse(JSON.stringify(qs.parse(result?.data)));
      }
    }, error => {
      console.log('activatedRoute queryParams error', error);
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
    console.log('update');

    this.taskDatabase.transaction('rw', this.taskDatabase.task, async () => {
      try {
        return Promise.all([
          this.taskDatabase.task
            .where('slug')
            .equals(this.data.slug)
            .modify(this.data)
        ]);
      } catch (error) {
        console.log('add error', error);
        await Promise.reject([error]);
      }

    }).then(async (result) => {
      console.log('transaction result', result);

      if (result != undefined) {
        console.log('added task', `task ID: ${result[0]}`);
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
          console.log('navigateRoot error', error);
        }
      }

    }).catch(async error => {
      console.log(error.stack || error);

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
