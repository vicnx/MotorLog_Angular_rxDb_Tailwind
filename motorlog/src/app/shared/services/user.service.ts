import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RxUserDocumentType, UserModel } from '@shared/models/user.model';
import { CONSTANTS } from './../app-constants';
import { DBService } from './db.service';
import { UtilsService } from './utils.service';

@Injectable({ providedIn: 'root' })
export class UserService {
	dbSvc = inject(DBService);
  utilsSvc = inject(UtilsService);
	user = signal<UserModel>({} as UserModel);
	isUserLogged = signal<boolean>(false);
	userExistOnBd: Signal<boolean> = computed(() => (this.user() ? true : false));
	routerSvc = inject(Router);

	getUser(): any {
		const query = this.dbSvc.db.user.findOne('1');
		query.exec().then((results: any) => {
			this.user.update((val) => (val = results));
			this.setLogginUser(results ? true : false);
		});
	}

	// prettier-ignore
	setUser(name: string) {
		const data = { id: '1', name: name, avatar: this.utilsSvc.generateAvatar(name), resgister_date: new Date(), gender: null, username: this.utilsSvc.generateUsername(name)} as RxUserDocumentType;
		const query = this.dbSvc.db.user.insert(data);
		query.then(() => {
				this.getUser();
			}).catch((error) => {
				throw error;
		});
	}

	public checkUserExistsDb(): any {
		const query = this.dbSvc.db.user.findOne('1');
		query.exec().then((res: any) => {
			this.user.set(res);
			if (res) {
				this.checkSessionLogged();
			} else {
				this.setLogginUser(false);
			}
		});
	}

	public setLogginUser(logged: boolean): void {
		this.isUserLogged.set(logged);
		sessionStorage.setItem('isUserLogged', logged.toString());
		if (!logged) {
			this.routerSvc.navigate([CONSTANTS.routes.welcome]);
		}
	}

	private checkSessionLogged(): void {
		let aux = sessionStorage.getItem('isUserLogged') == 'true' ? true : false;
		this.isUserLogged.set(aux);
	}
}
