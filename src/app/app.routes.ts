import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    loadComponent: () => import('./components/explore/explore').then(m => m.ExploreComponent)
  },
  {
    path: 'food',
    loadComponent: () => import('./components/food/food').then(m => m.FoodComponent)
  },
  {
    path: '**',
    redirectTo: 'explore'
  }
];
