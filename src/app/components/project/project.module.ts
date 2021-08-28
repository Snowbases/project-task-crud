import { NgModule } from '@angular/core';
import { CreateComponent } from './create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { UpdateComponent } from './update/update.component';
import { UpdateModule } from './update/update.module';
import { CreateModule } from './create/create.module';

const routes: Routes = [
  {
    path: 'create-project',
    component: CreateComponent
  },
  {
    path: 'update-project',
    component: UpdateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    CreateModule,
    UpdateModule,
  ]
})
export class ProjectModule { }
