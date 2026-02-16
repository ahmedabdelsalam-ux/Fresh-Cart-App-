import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);

  const platId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((err) => {
      if (isPlatformBrowser(platId)) {
        toastrService.error(err.error.message);
      }

      return throwError(() => err);
    }),
  );
};
