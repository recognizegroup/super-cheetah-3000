import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedGuard {
  constructor(private router: Router, private appAuthentication: AuthenticationService) {
  }

  async canActivate(): Promise<boolean> {
    const access = this.appAuthentication.isLoggedIn();

    if (access) {
      await this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }

}
