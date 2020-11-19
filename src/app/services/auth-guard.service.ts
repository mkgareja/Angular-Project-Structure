import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { Constants, URL_ROUTES } from '@constant/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.localStorage.readStorage(Constants.TOKEN)) {
      this.router.navigate(['/']);
      return false;
    } else {
      if (!this.localStorage.readStorage(Constants.SHOP_TIME)) {
        return true;
      }
      this.router.navigate([
        `${URL_ROUTES.SET_TIME}/` +
          this.localStorage.readStorage(Constants.SID),
      ]);
      return false;
    }
  }
}
