import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { GlobalService } from '../global.service';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (sessionStorage.getItem("loggedIn")) {
      return true;
    }
    else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}