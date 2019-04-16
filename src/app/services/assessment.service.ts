import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { GlobalService } from '../global.service';
import { Constants } from '../utility/constants';

@Injectable()
export class AssessmentService {

  private baseUrl:string=Constants.BASE_URL+'/assessment';

  constructor(
    private _http:HttpClient
  ) { }

  getTeamAssessments(teamId:string) {
    return this._http.get(this.baseUrl+'/team/'+teamId+'/getTeamAssessments');
  }

  getProductAssessments(productId:string) {
    return this._http.get(this.baseUrl+'/product/'+productId+'/getProductAssessments');
  }

  errorHandler(error:Response){
  	return Observable.throw(error);
  }
}

