import {Injectable} from '@angular/core';
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";
import {filter, map, race} from "rxjs";
import {first} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private msalBroadcastService: MsalBroadcastService,
              private msalService: MsalService) { }


  waitForRedirect() {
    return race([
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg) => msg.eventType === 'msal:loginFailure'),
        ),
      this.msalService.handleRedirectObservable(),
    ]).pipe(
      first(),
      map(() => this.hasAccessToApplication()),
    );
  }

  isLoggedIn() {
    return !this.isAuthenticationEnabled || this.msalService.instance.getAllAccounts().length > 0;
  }

  get userEmail() {
    return this.msalService.instance.getAllAccounts()[0].username;
  }

  get userRoles() {
    return this.msalService.instance.getAllAccounts()[0]?.idTokenClaims?.roles ?? [];
  }

  hasAccessToApplication() {
    if (!this.isLoggedIn()) {
      return false;
    }

    return true;
  }

  async logout() {
    this.msalService.logout();
  }

  get isAuthenticationEnabled() {
    return environment.auth.enabled;
  }
}
