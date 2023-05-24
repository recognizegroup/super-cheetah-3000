import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(private authenticationService: AuthenticationService) { }

  logout() {
    this.authenticationService.logout();
  }

  get userEmailAddress() {
    return this.authenticationService.userEmail;
  }
}
