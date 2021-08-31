import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/internal/operators";
import { environment } from '../../../environments/environment';
import { ToastEnterAnimation, ToastLeaveAnimation } from '../../animations/toast';
import { UtilityService } from '../utility/utility.service';
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private storage: Storage,
    private httpClient: HttpClient,
    private utilityService: UtilityService
  ) { }

  async refreshToken(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post(`${environment.url}/auth/refresh`, data, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getProfileInformation(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post(`${environment.url}/auth/me`, data, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async storeProject(data: any): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post(`${environment.url}/projects`, data, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async deleteProject(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .delete(`${environment.url}/projects/${data?.id}`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async updateProject(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .put(`${environment.url}/projects/${data?.id}`, data, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getProjects(): Promise<any> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/projects`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getProjectDetail(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/projects/${data?.project_id}`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async storeTask(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post(`${environment.url}/tasks`, data, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async deleteTask(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .delete(`${environment.url}/tasks/${data?.id}`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async updateTask(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .put(`${environment.url}/tasks/${data?.id}`, data, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getTasks(): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/tasks`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getProjectTasks(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/projects/${data?.id}/tasks`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getTasksDetail(data): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/tasks/${data?.task_id}`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getAllUsers(): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/lookups/users`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

  async getAllProjects(): Promise<Object> {
    const { access_token } = await this.storage.get('auth');
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .get(`${environment.url}/lookups/projects`, { headers })
      .pipe(
        catchError(async (error) => {
          if (error?.status == 0) {
            await this.utilityService.showToastOnce({
              message: 'Connection failed. Please try again.',
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
            throw error;
          } else {
            throw error;
          }
        })
      ).toPromise();
  }

}
