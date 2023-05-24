import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard {
  constructor(private appAuthentication: AuthenticationService, private router: Router) {
  }

  async canActivate(): Promise<boolean> {
    const access = this.appAuthentication.isLoggedIn();

    if (!access) {
      await this.router.navigateByUrl('/auth/login');
      return false;
    }

    return true;
  }
}
