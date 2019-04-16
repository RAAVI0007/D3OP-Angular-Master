import { Injectable, NgModule} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/do';
import { AutoLogoutService } from '../services/auto-logout.service';

@Injectable()
export class HttpRequestInterceptors implements HttpInterceptor {
  constructor(private router: Router,
    private autoLogoutService:AutoLogoutService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const headers = new HttpHeaders({
        'Authorization': 'Bearer '+ sessionStorage.getItem("token"),
        'Content-Type': 'application/json'
      });
	  const cloneReq = req.clone({headers});
  return next.handle(cloneReq).do((event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
       sessionStorage.setItem("token", event.headers.get('Authorization'));
       sessionStorage.setItem("role", event.headers.get('role'));
       
       if (event.status === 403) {
        this.router.navigateByUrl('/unauthorizedAccess');   
      }
    }
  }, (err: any) => {

    if (err instanceof HttpErrorResponse) {
      if (err.status === 403) {
        this.router.navigateByUrl('/unauthorizedAccess');   
      }
       if (err.status === 401) {
        this.autoLogoutService.logout('false');
      }
    }
  });
}
}