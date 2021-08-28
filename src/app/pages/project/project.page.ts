import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ToastController, ToastOptions } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as qs from 'querystring';
import { ProjectDatabase } from '../../adapters/project.adapter';
import { TaskDatabase } from '../../adapters/task.adapter';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  @ViewChild(DatatableComponent) datatableComponent: DatatableComponent;

  projectDatabase: ProjectDatabase;
  taskDatabase: TaskDatabase;
  projects: Project[];
  toast: HTMLIonToastElement;

  constructor(
    public alertController: AlertController,
    public navController: NavController,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    // Instantiate it
    this.projectDatabase = new ProjectDatabase();

    // Open it
    this.projectDatabase
      .open()
      .catch(error => {
        console.error(`Open failed: ${error.stack}`);
      });

    this.taskDatabase = new TaskDatabase();

    // Open it
    this.taskDatabase
      .open()
      .catch(error => {
        console.error(`Open failed: ${error.stack}`);
      });

    this.read();
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

  read() {
    console.log('read');

    this.projectDatabase.transaction('rw', this.projectDatabase.project, async () => {
      try {
        const project = await this.projectDatabase.project.toArray();
        console.log('read project', JSON.stringify(project));
        this.projects = project;
      } catch (error) {
        console.log('read error', error);
      }

    }).catch(e => {
      console.log(e.stack || e);
    });
  }

  async navigateCreateProject() {
    try {
      await this.navController.navigateForward('/project/create-project', {
        animationDirection: 'forward'
      });
    } catch (error) {
      console.log('navigateForward error', error);
    }
  }

  async selectToEdit(project: Project) {
    try {
      await this.navController.navigateForward('/project/update-project', {
        animationDirection: 'forward',
        queryParams: {
          data: qs.stringify((project as any))
        }
      });
    } catch (error) {
      console.log('navigateForward error', error);
    }
  }


  async selectToDelete(project: Project) {
    const alert = await this.alertController.create({
      mode: 'md',
      cssClass: 'back-alert',
      header: 'Delete confirmation',
      message: `Delete project name: ${project?.project_name}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });

    alert.onWillDismiss().then(async (result: any) => {
      console.log('onWillDismiss result', result);
      if (result?.data != undefined && result?.data) {

        await Promise.all([
          this.projectDatabase.transaction('rw', this.projectDatabase.project, async () => {
            try {
              return Promise.all([
                this.projectDatabase.project
                  .where("project_slug")
                  .equals(project?.project_slug)
                  .delete()
              ]);
            } catch (error) {
              console.log('delete error', error);
              return Promise.reject([error]);
            }

          }),
          this.taskDatabase.transaction('rw', this.taskDatabase.task, async () => {
            try {
              return Promise.all([
                this.taskDatabase.task
                  .where("project_id")
                  .equals(project?.project_slug)
                  .delete()
              ]);
            } catch (error) {
              console.log('delete error', error);
              return Promise.reject([error]);
            }

          })
        ]).then(async (result) => {
          console.log('transaction result', result);

          if (result != undefined) {
            const toastOptions: ToastOptions = {
              message: 'Successfully delete project.',
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

            this.read();

          } else {
            const toastOptions: ToastOptions = {
              message: `Failed to delete. Record doesn't exist.`,
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
            message: 'Failed to delete project. Please try again.',
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
    });
    await alert.present();
  }

  async selectToViewTask(project: Project) {
    try {
      await this.navController.navigateForward('/task', {
        animationDirection: 'forward',
        queryParams: {
          data: qs.stringify((project as any))
        }
      });
    } catch (error) {
      console.log('navigateForward error', error);
    }
  }
}
