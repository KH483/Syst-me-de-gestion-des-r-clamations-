import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRole: string): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const role = authService.getRole();
  if (role !== requiredRole) {
    if (role === 'CLIENT') {
      return router.createUrlTree(['/client/dashboard']);
    } else if (role === 'AGENT_SAV') {
      return router.createUrlTree(['/agent/dashboard']);
    }
    return router.createUrlTree(['/login']);
  }

  return true;
};
