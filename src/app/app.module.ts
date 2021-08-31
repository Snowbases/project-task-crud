import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule, StorageConfig } from "@ionic/storage";
import { IonicConfig } from "@ionic/core";

const config: IonicConfig = {
  mode: 'ios'
}

const storageConfig: StorageConfig = {
  name: '__project_task_crud',
  driverOrder: ['websql']
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    IonicModule.forRoot(config),
    IonicStorageModule.forRoot(storageConfig),
    BsDatepickerModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    NgxDatatableModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
