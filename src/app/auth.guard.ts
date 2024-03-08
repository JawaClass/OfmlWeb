import { CanActivateFn } from '@angular/router';
import { SessionService } from './session/session.service'
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {

  return inject(SessionService).hasSession()
  console.log("CanActivateFn ::::::", route, ":::", state);
  
  return true;
};
