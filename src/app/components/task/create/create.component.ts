import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController, ToastOptions } from '@ionic/angular';
import { TaskDatabase } from '../../../adapters/task.adapter';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { v1 as uuidv1 } from 'uuid';
import { Task, TaskStatus } from '../../../interfaces/task.interface';
import { ActivatedRoute } from '@angular/router';
import * as qs from 'querystring';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
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
        const { project_slug } = JSON.parse(JSON.stringify(qs.parse(result?.data)));
        this.data.project_id = project_slug;
      }
    }, error => {
      console.log('activatedRoute queryParams error', error);
    });
  }

  ionViewWillEnter() {
    // Generate UUID based on time
    this.data.slug = uuidv1({
      node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
      clockseq: 0x1234,
      msecs: new Date().getTime(),
      nsecs: 5678,
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

  async create() {
    console.log('create');

    this.taskDatabase.transaction('rw', this.taskDatabase.task, async () => {
      try {
        return await Promise.all([await this.taskDatabase.task.add(this.data)]);
      } catch (error) {
        console.log('add error', error);
        await Promise.reject([error]);
      }

    }).then(async (result) => {
      console.log('transaction result', result);

      if (result != undefined) {
        console.log('added task', `task ID: ${result[0]}`);
        const toastOptions: ToastOptions = {
          message: 'Successfully create task.',
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
        message: 'Failed to create task. Please try again.',
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
