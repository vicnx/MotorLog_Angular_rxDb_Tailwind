import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RxUserDocumentType, UserModel } from '@shared/models/user.model';
import { CONSTANTS } from './../app-constants';
import { DBService } from './db.service';
import { UtilsService } from './utils.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CustomService } from '@shared/models/custom-service.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    dbSvc = inject(DBService);
    utilsSvc = inject(UtilsService);
    user = signal<UserModel>({} as UserModel);
    page = signal<string>("");
    isUserLogged = signal<boolean>(false);
    userExistOnBd: Signal<boolean> = computed(() => (this.user() ? true : false));
    routerSvc = inject(Router);
    confirmationService = inject(ConfirmationService);
    translateSvc = inject(TranslateService);
    displayWelcomeDialogInfo = signal<boolean>(false);

    getUser(): any {
        const query = this.dbSvc.db.user.findOne('1');
        query.exec().then((results: any) => {
            this.user.update((val) => (val = results));
            this.setLogginUser(results ? true : false);
        });
    }

    // prettier-ignore
    setUser(name: string) {
      const data = { id: '1', name: name, avatar: this.utilsSvc.generateAvatar(name), resgister_date: new Date().toString(), gender: null, username: this.utilsSvc.generateUsername(name)} as RxUserDocumentType;
      const query = this.dbSvc.db.user.insert(data);
      query.then(() => {
          this.getUser();
        }).catch((error: any) => {
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

    public logoutUser(): void {
        this.confirmationService.confirm({
            message: this.translateSvc.instant('confirm.default_msg'),
            header: this.translateSvc.instant('confirm.default_header'),
            icon: 'fas fa-exclamation-triangle',
            rejectButtonStyleClass: 'p-button-text',
            acceptLabel:this.translateSvc.instant('confirm.default_yes'),
            rejectLabel:this.translateSvc.instant('confirm.default_no'),
            key: 'confirmDialog',
            accept: () => {
                this.setLogginUser(false);
            },
            reject: () => {}
        });
    }

    // Nueva función para actualizar el usuario
    public updateUser(id: string, updatedData: Partial<UserModel>): Observable<void> {
        return from(this.dbSvc.db.user.findOne(id).exec()).pipe(
            switchMap((user: any) => {
                if (user) {
                    return from(user.update({ $set: updatedData })).pipe(
                        switchMap(() => {
                          this.getUser();
                        //   this.user.update((val) => {
                        //     console.log('Current value:', val);
                        //     console.log('Updated data:', updatedData);
                        //     const newUserData = { ...val, ...updatedData };
                        //     console.log('Final merged data:', newUserData);
                        //     return newUserData;
                        // });
                            return new Observable<void>((observer) => {
                                observer.next(); // Emitir valor
                                observer.complete(); // Completar la observable
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
        switchMap((user: any) => {
          if (user) {
            const userData = user.toJSON();
            const customServices = userData.customServices || [];

            const nextId = customServices.length > 0
              ? Math.max(...customServices.map((service: CustomService) => service.id)) + 1
              : 1;

            const serviceWithId = { ...newCustomService, id: nextId, value: `${newCustomService.value}_${nextId}` };

            const updatedCustomServices = [...customServices, serviceWithId];

            return from(
              user.update({
                $set: { customServices: updatedCustomServices }
              })
            ).pipe(
              switchMap(() => {
                this.getUser();
                return from([serviceWithId]);
              })
            );
          } else {
            return throwError(`User with id '1' not found`);
          }
        })
      );
    }


    getCustomServices(): Observable<CustomService[]> {
      return from(this.dbSvc.db.user.findOne('1').exec()).pipe(
        switchMap((user: any) => {
          if (user) {
            const userData = user.toJSON();
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
        switchMap((user: any) => {
          if (user) {
            const userData = user.toJSON();
            const updatedCustomServices = userData.customServices.filter(
              (service: CustomService) => service.id !== serviceId
            );
            return from(
              user.update({
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
}
