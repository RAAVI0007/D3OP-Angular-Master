import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../utility/constants';

@Injectable()
export class ProductReportsService {

  constructor(private _http:HttpClient) { }

  private baseUrl:string=Constants.BASE_URL+'/practice';
  getReportsData(assessmentId:string) {
    return this._http.get(this.baseUrl+'/'+assessmentId+'/product/getProductReportsData');
  }


}
