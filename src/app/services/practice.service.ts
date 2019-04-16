import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { GlobalService } from '../global.service';
import { Constants } from '../utility/constants';

@Injectable()
export class PracticeService {

  private baseUrl:string=Constants.BASE_URL+'/practice';

  constructor(private _http:HttpClient) { }

  getAllTeamPractice(type: string) {
    return this._http.get(this.baseUrl+'/'+type+'/getPractices');
  }

}
