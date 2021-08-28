import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateComponent } from './update.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    UpdateComponent
  ]
})
export class UpdateModule { }
