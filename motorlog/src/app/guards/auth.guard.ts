import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { CONSTANTS } from '@shared/app-constants';
import { Observable } from 'rxjs';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const router: Router = inject(Router);
    const isUserLogged = sessionStorage.getItem('isUserLogged');
    if (route.url.toString() === CONSTANTS.routes.literal.welcome) {
        // Si la ruta es /welcome, permitir el acceso solo si no hay usuario logeado
        if (isUserLogged?.toString() === 'true') {
            return router.parseUrl(CONSTANTS.routes.home);
        }
    } else {
        // Si la ruta es diferente de /welcome, redirigir a /welcome si no hay usuario logeado
        if (isUserLogged?.toString() !== 'true') {
            return router.parseUrl(CONSTANTS.routes.welcome);
        }
    }

    return true;
};
