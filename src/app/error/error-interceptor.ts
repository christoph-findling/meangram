import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error.component';


@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                let errorMessage = 'an unknown error occured';
                if (error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.error.error.message) {
                    errorMessage = error.error.error.message;
                }
                this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
                return throwError(error);
            })
        );
    }
}
