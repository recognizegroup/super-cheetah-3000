import { Component, signal, Inject } from '@angular/core';
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import { RedirectRequest } from '@azure/msal-browser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly loading = signal(false);

  constructor(private msalService: MsalService, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration) { }

  login() {
    this.loading.set(true)

    this.msalService.loginRedirect({
      redirectStartPage: environment.auth.redirectUri,
      prompt: 'select_account',
      ...this.msalGuardConfig.authRequest
    } as RedirectRequest);
  }
}
