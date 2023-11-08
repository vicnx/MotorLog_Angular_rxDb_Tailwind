import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    @Inject(NgxSpinnerService) private spinnerService: any;

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('caught');
        this.totalRequests++;
        this.spinnerService.show();
        return next.handle(request).pipe(
            finalize(() => {
                this.totalRequests--;
                if (this.totalRequests == 0) {
                    this.spinnerService.hide();
                }
            })
        );
    }
}
