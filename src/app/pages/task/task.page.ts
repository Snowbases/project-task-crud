import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ToastController, ToastOptions } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Task, TaskStatus } from '../../interfaces/task.interface';
import * as qs from 'querystring';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../interfaces/project.interface';
import { TaskDatabase } from '../../adapters/task.adapter';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import * as moment from "moment";

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  @ViewChild(DatatableComponent) datatableComponent: DatatableComponent;

  taskDatabase: TaskDatabase;
  project: Project;
  tasks: Task[];
  toast: HTMLIonToastElement;

  taskStatus: any[] = ["To-Do", "Doing", "Done"];

  constructor(
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public navController: NavController,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe(async (result: any) => {
      console.log('activatedRoute queryParams result', result);
      if (result?.data != null && result?.data != undefined && result?.data != '') {
        this.project = JSON.parse(JSON.stringify(qs.parse(result?.data)));
      }

    }, error => {
      console.log('activatedRoute queryParams error', error);
    });

    this.taskDatabase = new TaskDatabase();

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

    this.taskDatabase.transaction('rw', this.taskDatabase.task, async () => {
      try {
        const task = await this.taskDatabase.task
          .where('project_id')
          .equals(this.project.project_slug)
          .toArray();

        console.log('read task', JSON.stringify(task));
        this.tasks = task;
      } catch (error) {
        console.log('read error', error);
      }

    }).catch(e => {
      console.log(e.stack || e);
    });
  }

  async navigateCreateTask() {
    try {
      await this.navController.navigateForward('/task/create-task', {
        animationDirection: 'forward',
        queryParams: {
          data: qs.stringify(JSON.parse(JSON.stringify(this.project)))
        }
      });
    } catch (error) {
      console.log('navigateForward error', error);
    }
  }

  async selectToEdit(task: Task) {
    const data = {
      ...task,
      due_date: moment(task.due_date).format('DD/MM/YYYY') || '' // Avoiding ISO Timezone due to ':' symbol before passing
    }
    try {
      await this.navController.navigateForward('/task/update-task', {
        animationDirection: 'forward',
        queryParams: {
          data: qs.stringify((data as any))
        }
      });
    } catch (error) {
      console.log('navigateForward error', error);
    }
  }

  async selectToDelete(task: Task) {
    console.log('selectToDelete', task);

    const alert = await this.alertController.create({
      mode: 'md',
      cssClass: 'back-alert',
      header: 'Delete confirmation',
      message: `Delete task title: ${task?.title}?`,
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

        this.taskDatabase.transaction('rw', this.taskDatabase.task, async () => {
          try {
            return await Promise.all([
              await this.taskDatabase.task
                .where("slug")
                .equals(task?.slug)
                .delete()
            ]);
          } catch (error) {
            console.log('delete error', error);
            await Promise.reject([error]);
          }

        }).then(async (result) => {
          console.log('transaction result', result);

          if (result != undefined && result[0] == 1) {
            const toastOptions: ToastOptions = {
              message: 'Successfully delete task.',
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
            message: 'Failed to delete task. Please try again.',
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

}
