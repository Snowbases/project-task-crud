import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController, ToastOptions } from '@ionic/angular';
import { v1 as uuidv1 } from 'uuid';
import { ProjectDatabase } from '../../../adapters/project.adapter';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  data: Project = {
    id: '',
    project_name: '',
    project_slug: '',
    project_description: '',
    project_manager: '',
  }

  validation_messages = {
    id: [
      { type: 'required', message: 'ID is required' },
      { type: 'valid', message: '' }
    ],
    project_name: [
      { type: 'required', message: 'Project Name is required' },
      { type: 'valid', message: '' }
    ],
    project_slug: [
      { type: 'required', message: 'Project Slug is required' },
      { type: 'valid', message: '' }
    ],
    project_description: [
      { type: 'valid', message: '' }
    ],
    project_manager: [
      { type: 'required', message: 'Project Manager is required' },
      { type: 'valid', message: '' }
    ]
  }

  projectForm: FormGroup;
  projectDatabase: ProjectDatabase;

  toast: HTMLIonToastElement;

  constructor(
    public toastController: ToastController,
    public navController: NavController
  ) {
    this.projectForm = new FormGroup({
      id: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      project_name: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      project_slug: new FormControl('', {
        validators: Validators.compose([
          Validators.required
        ]),
        updateOn: 'change'
      }),
      project_description: new FormControl('', {
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
    // Instantiate it
    this.projectDatabase = new ProjectDatabase();

    // Open it
    this.projectDatabase.open().catch(error => {
      console.error(`Open failed: ${error.stack}`);
    });
  }

  ionViewWillEnter() {
    // Generate UUID based on time
    this.data.project_slug = uuidv1({
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

    this.projectDatabase.transaction('rw', this.projectDatabase.project, async () => {
      try {
        return await Promise.all([await this.projectDatabase.project.add(this.data)]);
      } catch (error) {
        console.log('add error', error);
        await Promise.reject([error]);
      }

    }).then(async (result) => {
      console.log('transaction result', result);

      if (result != undefined) {
        console.log('added project', `project ID: ${result[0]}`);
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
      }

    }).catch(async error => {
      console.log(error.stack || error);

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
