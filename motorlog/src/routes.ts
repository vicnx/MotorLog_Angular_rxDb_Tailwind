import { Routes } from "@angular/router";
import { AuthGuard } from "./app/guards/auth.guard";


export const routes: Routes =[
  {
    path: 'home',
    loadComponent: () => import("@pages/home/home.component").then((c)=> c.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadComponent: () => import("@pages/welcome/welcome.component").then((c)=> c.WelcomeComponent),
    canActivate: [AuthGuard]
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
