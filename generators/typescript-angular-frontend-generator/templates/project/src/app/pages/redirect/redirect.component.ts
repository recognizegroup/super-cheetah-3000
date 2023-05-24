import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    const authenticated = await firstValueFrom(this.authenticationService.waitForRedirect());

    if (authenticated) {
      await this.router.navigateByUrl('/');
    } else {
      await this.router.navigateByUrl('/auth/login');
    }
  }
}
