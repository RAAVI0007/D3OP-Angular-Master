import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from '../models/user';
import 'rxjs/add/operator/toPromise';
import { Constants } from '../utility/constants';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AuthService {
  private baseURL: string = Constants.BASE_URL;
  
  headers: Headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http, private _http:HttpClient) {}

  login(user: User): Promise<any> {
    let url: string = this.baseURL+'/token/generate-token';
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

  ensureAuthenticated(token): Promise<any> {
    let url: string = this.baseURL+'/userHome';
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: '${token}'
    });
    return this.http.get(url, {headers: headers}).toPromise();
  }

  forgotPassword(email:string) {
    return this._http.get(this.baseURL+'/token/findEmail?email='+email);
  }

  validateAnswer(profile:any) {
    return this._http.post(this.baseURL+"/token/validateAnswer", profile);
  }

}