import { HttpInterceptorFn } from '@angular/common/http';
import { storedKey } from '../../constants/stored_Key';
import { inject, PLATFORM_ID } from '@angular/core';
import { platform } from 'os';
import { isPlatformBrowser } from '@angular/common';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platId)) {
    const token = localStorage.getItem(storedKey.userToken);

    if (req.url.includes('cart') || req.url.includes('orders') || req.url.includes('wishlist')) {
      if (token) {
        req = req.clone({
          setHeaders: {
            token: token,
          },
        });
      }
    }
  }

  return next(req);
};
