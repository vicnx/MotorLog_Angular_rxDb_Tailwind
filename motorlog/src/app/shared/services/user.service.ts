import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '@shared/models/user.model';
import { CONSTANTS } from './../app-constants';
import { DBService } from './db.service';
import { UtilsService } from './utils.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CustomService } from '@shared/models/custom-service.model';
import { CustomLocation } from '@shared/models/custom-location.model';

@Injectable({ providedIn: 'root' })
export class UserService {
	dbSvc = inject(DBService);
	utilsSvc = inject(UtilsService);
	user = signal<UserModel>({} as UserModel);
	page = signal<string>('');
	isUserLogged = signal<boolean>(false);
	userExistOnBd: Signal<boolean> = computed(() => (this.user() ? true : false));
	routerSvc = inject(Router);
	confirmationService = inject(ConfirmationService);
	translateSvc = inject(TranslateService);
	displayWelcomeDialogInfo = signal<boolean>(false);

	getUser(): void {
		const query = this.dbSvc.db.user.findOne('1');
		query.exec().then((doc: any) => {
			const userData = doc ? (doc.toJSON ? doc.toJSON() : doc) : ({} as UserModel);
			this.user.set(userData);
			this.setLogginUser(!!doc);
		});
	}

	setUser(name: string): void {
		const data = {
			id: '1',
			name: name,
			avatar: this.utilsSvc.generateAvatar(name),
			resgister_date: new Date().toString(),
			gender: '',
			username: this.utilsSvc.generateUsername(name)
		};
		const query = this.dbSvc.db.user.insert(data as any);
		query
			.then(() => {
				this.getUser();
			})
			.catch((error: unknown) => {
				throw error;
			});
	}

	public checkUserExistsDb(): void {
		const query = this.dbSvc.db.user.findOne('1');
		query.exec().then((doc: any) => {
			const res = doc ? (doc.toJSON ? doc.toJSON() : doc) : null;
			if (res) {
				this.user.set(res);
				this.checkSessionLogged();
			} else {
				this.user.set({} as UserModel);
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
		const aux = sessionStorage.getItem('isUserLogged') === 'true';
		this.isUserLogged.set(aux);
	}

	public logoutUser(): void {
		this.confirmationService.confirm({
			message: this.translateSvc.instant('confirm.default_msg'),
			header: this.translateSvc.instant('confirm.default_header'),
			icon: 'fas fa-exclamation-triangle',
			rejectButtonStyleClass: 'p-button-text',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.setLogginUser(false);
			},
			reject: () => {}
		});
	}

	public updateUser(id: string, updatedData: Partial<UserModel>): Observable<void> {
		return from(this.dbSvc.db.user.findOne(id).exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					return from(userDoc.update({ $set: updatedData })).pipe(
						switchMap(() => {
							this.getUser();
							return new Observable<void>((observer) => {
								observer.next();
								observer.complete();
							});
						})
					);
				} else {
					throw new Error(`User with id ${id} not found`);
				}
			})
		);
	}

	addCustomServiceToUser(newCustomService: Omit<CustomService, 'id'>): Observable<any> {
		return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					const userData = userDoc.toJSON ? userDoc.toJSON() : userDoc;
					const customServices = userData.customServices || [];

					const nextId =
						customServices.length > 0
							? Math.max(...customServices.map((service: CustomService) => service.id)) + 1
							: 1;

					const serviceWithId: CustomService = {
						...newCustomService,
						id: nextId,
						value: `${newCustomService.value}_${nextId}`
					};

					const updatedCustomServices = [...customServices, serviceWithId];

					return from(
						userDoc.update({
							$set: { customServices: updatedCustomServices }
						})
					).pipe(
						switchMap(() => {
							this.getUser();
							return from([serviceWithId]);
						})
					);
				} else {
					return throwError(() => new Error(`User with id '1' not found`));
				}
			})
		);
	}

	getCustomServices(): Observable<CustomService[]> {
		return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					const userData = userDoc.toJSON ? userDoc.toJSON() : userDoc;
					return new Observable<CustomService[]>((observer) => {
						observer.next(userData.customServices || []);
						observer.complete();
					});
				} else {
					throw new Error(`User with id '1' not found`);
				}
			})
		);
	}

	removeCustomServiceFromUser(serviceId: number): Observable<any> {
		return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					const userData = userDoc.toJSON ? userDoc.toJSON() : userDoc;
					const updatedCustomServices = (userData.customServices || []).filter(
						(service: CustomService) => service.id !== serviceId
					);
					return from(
						userDoc.update({
							$set: { customServices: updatedCustomServices }
						})
					).pipe(
						switchMap(() => {
							this.getUser();
							return from(['OK']);
						})
					);
				} else {
					throw new Error(`User with id '1' not found`);
				}
			})
		);
	}

	addCustomLocationToUser(newCustomLocation: Omit<CustomLocation, 'id'>): Observable<any> {
		return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					const userData = userDoc.toJSON ? userDoc.toJSON() : userDoc;
					const customLocations = userData.customLocations || [];

					const nextId =
						customLocations.length > 0
							? Math.max(...customLocations.map((loc: CustomLocation) => loc.id)) + 1
							: 1;

					const locWithId: CustomLocation = {
						...newCustomLocation,
						id: nextId,
						value: `${newCustomLocation.value}_${nextId}`
					};

					const updatedCustomLocations = [...customLocations, locWithId];

					return from(
						userDoc.update({
							$set: { customLocations: updatedCustomLocations }
						})
					).pipe(
						switchMap(() => {
							this.getUser();
							return from([locWithId]);
						})
					);
				} else {
					return throwError(() => new Error(`User with id '1' not found`));
				}
			})
		);
	}

	getCustomLocations(): Observable<CustomLocation[]> {
		return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					const userData = userDoc.toJSON ? userDoc.toJSON() : userDoc;
					return new Observable<CustomLocation[]>((observer) => {
						observer.next(userData.customLocations || []);
						observer.complete();
					});
				} else {
					throw new Error(`User with id '1' not found`);
				}
			})
		);
	}

	removeCustomLocationFromUser(locationId: number): Observable<any> {
		return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
			switchMap((userDoc: any) => {
				if (userDoc) {
					const userData = userDoc.toJSON ? userDoc.toJSON() : userDoc;
					const updatedCustomLocations = (userData.customLocations || []).filter(
						(loc: CustomLocation) => loc.id !== locationId
					);
					return from(
						userDoc.update({
							$set: { customLocations: updatedCustomLocations }
						})
					).pipe(
						switchMap(() => {
							this.getUser();
							return from(['OK']);
						})
					);
				} else {
					throw new Error(`User with id '1' not found`);
				}
			})
		);
	}
}
