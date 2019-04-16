import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginRedirect implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (sessionStorage.getItem("loggedIn")) {
      this.router.navigateByUrl('/userHome');
      return false;
    }
    else {
      return true;
    }
  }
}