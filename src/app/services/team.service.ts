import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Assessment } from '../models/assessment.model';
import { Constants } from '../utility/constants';

@Injectable()
export class TeamService {

  private baseUrl:string=Constants.BASE_URL+'/engagement';
  
  constructor(
    private _http:HttpClient
  ) { }

  getTeamById(engagementId:string, teamId:string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/team/id/'+teamId);
  }

  createAssessment(assessment:Assessment, engagementId:string, teamId:string) {
    return this._http.post(this.baseUrl+'/'+engagementId+'/team/'+teamId+'/createAssessment', assessment);
  }

  
 getProductsLinkedToTeam(engagementId: string, teamId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/team/products/'+teamId);
  }
 
  getProductsLinkedToTeamNoPagination(page:number, engagementId: string, teamId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/team/id/'+teamId+'/noPagination?page='+page);
  }
 
  updateTeam(teamObj:any, engagementId: string) {
    return this._http.put(this.baseUrl+'/'+engagementId+'/team/saveTeam', teamObj);
  }

  getAllProductsNoPagination(engagementId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/getAvailableProducts');
  }

  // getPracticeScore(engagementId:string, assessmentId: string) {
  //   return this._http.get(this.baseUrl+'/'+engagementId+'/team/getPracticeScore/'+assessmentId);
  // }

  errorHandler(error:Response){
  	return Observable.throw(error);
  }

}
