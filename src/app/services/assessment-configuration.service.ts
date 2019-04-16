import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalService } from '../global.service';
import { Constants } from '../utility/constants';
import { AssessmentConfiguration } from '../models/assessment-configuration';

@Injectable()
export class AssessmentConfigurationService {

  private baseUrl:string=Constants.BASE_URL+'/practice';
  practice: AssessmentConfiguration = new AssessmentConfiguration();

  constructor(private _http:HttpClient) { }

  getPracticeByType(type: String) {
    return this._http.get(this.baseUrl+'/'+type+'/getPractices');
  }

  getDomains() {
    return this._http.get(this.baseUrl+'/getPracticesForDomain');
  }

  getDomainByType(type: string) {
    return this._http.get(this.baseUrl+'/'+type+'/getDomainByType');
  }

  getTitleByType(type: String) {
    return this._http.get(this.baseUrl+'/'+type+'/getTitles');
  }

  createCompetency(assessmentConfiguration: AssessmentConfiguration) {
    return this._http.post(this.baseUrl+'/createPractice', assessmentConfiguration);
  }

  getPracticeById(id: number) {
    return this._http.get(this.baseUrl+'/'+id+'/getPracticeById');
  }

  updatePractice(assessmentConfiguration: AssessmentConfiguration) {
    return this._http.put(this.baseUrl+'/updatePractice', assessmentConfiguration);
  }
}
