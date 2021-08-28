import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { CreateModule } from './create/create.module';
import { UpdateComponent } from './update/update.component';
import { UpdateModule } from './update/update.module';

const routes: Routes = [
  {
    path: 'create-task',
    component: CreateComponent
  },
  {
    path: 'update-task',
    component: UpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    CreateModule,
    UpdateModule,
  ]
})
export class TaskModule { }
