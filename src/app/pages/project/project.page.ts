import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ToastController, ToastOptions } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as qs from 'querystring';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  @ViewChild(DatatableComponent) datatableComponent: DatatableComponent;

  projects: any[] = [];
  toast: HTMLIonToastElement;

  constructor(
    public alertController: AlertController,
    public navController: NavController,
    public toastController: ToastController,
    public authenticationService: AuthenticationService,
    public utilityService: UtilityService,
    public apiService: ApiService
  ) {
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
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
    this.apiService.getProjects().then((response: any) => {
      console.log('getProjects response', response);
      this.projects = response;
    }).catch((error) => {
      console.log('getProjects error', error);

      const toastOptions: ToastOptions = {
        message: 'Failed to get project list. Please try again.',
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

  async navigateCreateProject() {
    try {
      await this.navController.navigateForward('/project/create-project', {
        animationDirection: 'forward'
      });
    } catch (error) {
      console.log('navigateForward error', error);
    }
  }

  async selectToEdit(project: any) {
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


  async selectToDelete(project: any) {
    const alert = await this.alertController.create({
      mode: 'md',
      cssClass: 'back-alert',
      header: 'Delete confirmation',
      message: `By deleting project, all tasks under
      project will also be deleted.`,
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
          id: project?.id
        }
        this.apiService.deleteProject(data).then(async (response: any) => {
          console.log('storeProject response', response);

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
          this.fetch();

        }).catch((error) => {
          console.log('deleteProject error', error);

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

  async selectToViewTask(project: any) {
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

  async logout() {
    const loading = await this.utilityService.loadingController.create({
      spinner: null,
      cssClass: 'loading-circular',
      mode: 'ios',
      message: '<ion-img class="spinner" src="/assets/icon/spinner.svg" alt=""></ion-img><div class="loading-content sc-ion-loading-ios">Logging out...</div>',
    });
    await loading.present();

    this.authenticationService
      .logout()
      .then(async (response) => {
        console.log('logout response', response);
        await loading.dismiss();

        try {
          await this.navController.navigateRoot('/login', {
            animationDirection: 'back'
          });
        } catch (error) {
          console.log('navigateRoot error', error);
        }

        await this.utilityService.showToastOnce({
          message: 'You have logout successfully.',
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
        });

      }).catch(async (error) => {
        console.log('logout error', error);
        await loading.dismiss();

        if (error?.error != undefined) {
          await this.utilityService.showToastOnce({
            message: error?.error,
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
          });
        }

      });
  }
}
