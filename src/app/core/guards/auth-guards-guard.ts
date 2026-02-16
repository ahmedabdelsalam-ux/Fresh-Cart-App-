import { CanActivateFn, Router } from '@angular/router';
import { storedKey } from '../constants/stored_Key';
import { inject, PLATFORM_ID } from '@angular/core';
import { platform } from 'os';
import { platformBrowser } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

export const authGuardsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const paltId = inject(PLATFORM_ID);

  if (isPlatformBrowser(paltId)) {
    if (localStorage.getItem(storedKey.userToken)) {
      return true;
    } else {
      return router.parseUrl('/login');
    }
  }

  return true;
};
