import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Constants } from '../utility/constants';

@Injectable()
export class LeftNavigationService {

  private baseUrl:string=Constants.BASE_URL+'/engagement';
  private status: string;

  constructor(private _http:HttpClient) { }

  getAllEngagementsWithTeamAndProducts() {
    return this._http.get(this.baseUrl+'/getAllEngagementsWithTeamAndProducts');
  }
}
