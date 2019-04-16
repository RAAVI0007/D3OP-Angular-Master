import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { GlobalService } from '../global.service';
import { Assessment } from '../models/assessment.model';
import { Constants } from '../utility/constants';

@Injectable()
export class PracticeScoreService {

  private baseUrl:string=Constants.BASE_URL+'/engagement';

  constructor(private _http:HttpClient) { }

  getTeamPracticeScore(engagementId:string, assessmentId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/team/getPracticeScore/'+assessmentId);
  }

  getProductPracticeScore(engagementId:string, assessmentId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/getPracticeScore/'+assessmentId);
  }

  updateTeamPracticeScore(engagementId: string, practiceScoreObject: any) {
    return this._http.put(this.baseUrl+'/'+engagementId+'/team/saveAssessment', practiceScoreObject);
  }

  updateProductPracticeScore(engagementId: string, practiceScoreObject: any) {
    return this._http.put(this.baseUrl+'/'+engagementId+'/product/saveAssessment', practiceScoreObject);
  }

  errorHandler(error:Response){
  	return Observable.throw(error);
  }
}
