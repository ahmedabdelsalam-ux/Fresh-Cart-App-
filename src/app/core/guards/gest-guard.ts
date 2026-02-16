import { inject, PLATFORM_ID } from '@angular/core';
import { storedKey } from './../constants/stored_Key';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const gestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platId)) {
    if (!localStorage.getItem(storedKey.userToken)) {
      return true;
    } else {
      return router.parseUrl('/home');
    }
  }

  return true;
};
