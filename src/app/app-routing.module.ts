import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication/authentication.guard';
import { LoginGuard } from './guard/login/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canLoad: [LoginGuard],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'project',
    canLoad: [AuthenticationGuard],
    loadChildren: () => import('./pages/project/project.module').then(m => m.ProjectPageModule)
  },
  {
    path: 'task',
    canLoad: [AuthenticationGuard],
    loadChildren: () => import('./pages/task/task.module').then(m => m.TaskPageModule)
  },
  {
    // Required to add at the of route
    path: '**',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
