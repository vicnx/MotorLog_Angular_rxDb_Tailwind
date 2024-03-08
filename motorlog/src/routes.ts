import { Routes } from "@angular/router";


export const routes: Routes =[
  {
    path: 'home',
    loadComponent: () => import("@pages/home/home.component").then((c)=> c.HomeComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import("@pages/welcome/welcome.component").then((c)=> c.WelcomeComponent),
  },
  // canActivate: [authGuard]
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   // canActivate: [authGuard],
  // },

  {
    path: '**',
    redirectTo: 'welcome'
  }
]
