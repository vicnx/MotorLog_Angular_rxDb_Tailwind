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
		path: 'add-maintenance',
		loadComponent: () => import('@pages/maintenance-details/maintenance-details.component').then((c) => c.MaintenanceDetailsComponent),
		canActivate: [AuthGuard],
		data: { isEdit: false }
	},
	{
		path: 'maintenance-details/:id',
		loadComponent: () => import('@pages/maintenance-details/maintenance-details.component').then((c) => c.MaintenanceDetailsComponent),
		canActivate: [AuthGuard],
		data: { isEdit: true }
	},
	{
		path: 'settings',
		loadComponent: () => import('@pages/settings/settings.component').then((c) => c.SettingsComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'profile',
		loadComponent: () => import('@pages/profile/profile.component').then((c) => c.ProfileComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'custom-service-list',
		loadComponent: () => import('@pages/custom-services-list/custom-services-list.component').then((c) => c.CustomServicesListComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'custom-service-add',
		loadComponent: () => import('@pages/custom-services-details/custom-services-details.component').then((c) => c.CustomServiceDetailsComponent),
		canActivate: [AuthGuard],
		data: { isConsulta: false }
	},
	{
		path: '**',
		redirectTo: 'welcome'
	}
];
