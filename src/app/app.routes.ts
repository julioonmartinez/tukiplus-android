import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      
      },
      {
        path: 'habit/:id',
        loadComponent: () => import('./pages/habit/habit.component').then((m) => m.HabitComponent),
      
      },
      // Puedes agregar más rutas hijas aquí
      // {
      //   path: 'about',
      //   loadComponent: () => import('./about/about.page').then(m => m.AboutPage),
      // }
    ],
  },
];
