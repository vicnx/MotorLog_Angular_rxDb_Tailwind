import { Routes } from "@angular/router";


export const routes: Routes =[
  {
    path: 'home',
    loadComponent: () => import("@pages/home/home.component").then((c)=> c.HomeComponent),
  },
  // canActivate: [authGuard]
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   // canActivate: [authGuard],
  // },

  {
    path: '**',
    redirectTo: 'home'
  }
]
