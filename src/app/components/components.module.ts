import { NgModule } from '@angular/core';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@NgModule({
  exports: [
    ProjectModule,
    TaskModule
  ]
})
export class ComponentsModule { }
