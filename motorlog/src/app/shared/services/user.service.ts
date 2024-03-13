import { Injectable, effect, inject, signal } from '@angular/core';
import { RxUserDocumentType, UserModel } from '@shared/models/user.model';
import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class UserService {
	dbSvc = inject(DBService);
	user = signal<UserModel>({} as UserModel);
	userExistonDb = signal<boolean>(false);

	getUser(): any {
		const query = this.dbSvc.db.user.findOne('1');
		query.exec().then((results: any) => {
			this.user.update((val) => (val = results));
      this.setLogginUser(results ? true :false);
		});
	}

	// prettier-ignore
	setUser(name: string) {
		const data = { id: '1', name: name} as RxUserDocumentType;
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
      this.setLogginUser(res ? true :false);
		});
	}

  private setLogginUser(logged: boolean): void {
    this.userExistonDb.set(logged);
    sessionStorage.setItem('isUserLogged', logged.toString())
  }
}
