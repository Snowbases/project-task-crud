import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController, ToastOptions } from '@ionic/angular';
import * as qs from 'querystring';
import { ProjectDatabase } from '../../../adapters/project.adapter';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../../animations/toast';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
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
    public activatedRoute: ActivatedRoute,
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

    this.activatedRoute.queryParams.subscribe(async (result: any) => {
      console.log('activatedRoute queryParams result', result);
      if (result?.data != null && result?.data != undefined && result?.data != '') {
        this.data = JSON.parse(JSON.stringify(qs.parse(result?.data)));
      }
    }, error => {
      console.log('activatedRoute queryParams error', error);
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

    this.projectDatabase.transaction('rw', this.projectDatabase.project, async () => {
      try {
        return await Promise.all([
          await this.projectDatabase.project
            .where("project_slug")
            .equals(this.data.project_slug)
            .modify(this.data)
        ]);
      } catch (error) {
        console.log('modify error', error);
        await Promise.reject([error]);
      }

    }).then(async (result) => {
      console.log('transaction result', result);

      if (result != undefined && result[0] == 1) {
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
      } else {
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
      }

    }).catch(async error => {
      console.log(error.stack || error);

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
