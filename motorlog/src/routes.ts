import { Routes } from '@angular/router';
import { AuthGuard } from './app/guards/auth.guard';

export const routes: Routes = [
	{
		path: 'home',
		loadComponent: () => import('@pages/home/home.component').then((c) => c.HomeComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'welcome',
		loadComponent: () => import('@pages/welcome/welcome.component').then((c) => c.WelcomeComponent),
		canActivate: [AuthGuard]
	},
  {
    path: 'add-vehicle',
    loadComponent: () => import('@pages/vehicle-details/vehicle-details.component').then((c) => c.VehicleDetailsComponent),
    canActivate: [AuthGuard],
    data: { isConsulta: false }
  },
  {
    path: 'vehicle-details/:id',
    loadComponent: () => import('@pages/vehicle-details/vehicle-details.component').then((c) => c.VehicleDetailsComponent),
    canActivate: [AuthGuard],
    data: { isConsulta: true }
  },
  {
		path: 'vehicles-list',
		loadComponent: () => import('@pages/vehicles-list/vehicles-list.component').then((c) => c.VehiclesListComponent),
		canActivate: [AuthGuard]
	},
	{
		path: '**',
		redirectTo: 'welcome'
	}
];
