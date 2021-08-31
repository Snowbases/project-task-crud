import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ToastController, ToastOptions } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as qs from 'querystring';
import { ActivatedRoute } from '@angular/router';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import * as moment from "moment";
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  @ViewChild(DatatableComponent) datatableComponent: DatatableComponent;

  project: any = {};
  tasks: any[] = [];
  toast: HTMLIonToastElement;

  constructor(
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public navController: NavController,
    public toastController: ToastController,
    public apiService: ApiService
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

    this.fetch();
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

  fetch() {
    console.log('fetch');

    this.apiService.getProjectTasks(this.project).then((response: any) => {
      console.log('getTasks response', response);
      this.tasks = response;
    }).catch((error) => {
      console.log('getTasks error', error);

      const toastOptions: ToastOptions = {
        message: 'Failed to get tasks project. Please try again.',
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

  async selectToEdit(task: any) {
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

  async selectToDelete(task: any) {
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
        const data = {
          id: task?.id
        }
        this.apiService.deleteTask(data).then(async (response: any) => {
          console.log('deleteTask response', response);

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
          this.fetch();

        }).catch((error) => {
          console.log('deleteTask error', error);

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

    await alert.present();
  }
}
