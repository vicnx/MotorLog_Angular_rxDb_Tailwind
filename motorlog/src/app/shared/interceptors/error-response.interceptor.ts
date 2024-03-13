import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const ErrorResponseInterceptor: HttpInterceptorFn = (req: any, next: any) => next(req).pipe(catchError(handleErrorResponse));

function handleErrorResponse(error: HttpErrorResponse) {
    //TODO toast error?
    const errorResponse = `Error status: ${error.status}, message: ${error.message}`;
    return throwError(() => errorResponse);
}
