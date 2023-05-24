import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
    selector: '[appHasSecurityRoles]'
})
export class HasSecurityRolesDirective implements OnInit {
    @Input('appHasSecurityRoles') roles: string = '';

    constructor(private elementRef: ElementRef, private authenticationService: AuthenticationService) {}

    ngOnInit() {
        this.checkAccess();
    }

    private checkAccess() {
        const roles = this.authenticationService.userRoles;
        const required = this.roles.split(',');

        const hasAccess = required.some(role => roles.includes(role));

        if (!hasAccess) {
            this.elementRef.nativeElement.remove();
        }
    }
}
