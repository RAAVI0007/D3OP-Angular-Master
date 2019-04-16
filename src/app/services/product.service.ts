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
export class ProductService {

  private baseUrl:string=Constants.BASE_URL+'/engagement';
 

  constructor(
              private _http:HttpClient
              ) { }

  getProductById(engagementId:string, productId:string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/id/'+productId);
  }

  createAssessment(assessment:Assessment, engagementId:string, productId:string) {
    return this._http.post(this.baseUrl+'/'+engagementId+'/product/'+productId+'/createAssessment', assessment);
  }

  
 getProductsLinkedToProduct(engagementId: string, productId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/id/'+productId);
  }
 
  getProductsLinkedToProductNoPagination(page:number, engagementId: string, productId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/id/'+productId+'/noPagination?page='+page);
  }
 
  updateProduct(productObj:any, engagementId: string) {
    return this._http.put(this.baseUrl+'/'+engagementId+'/product/saveProduct', productObj);
  }

  getAllProductsNoPagination(engagementId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/getAvailableProducts');
  }

  getTeamsLinkedToProduct(engagementId: string, productId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/teams/'+productId);
  }

  getTeamsLinkedToProductNoPagination(page:number, engagementId: string, productId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/id/'+productId+'/noPagination?page='+page);
  }

  getAllTeamsNoPagination(productId: string, engagementId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/'+productId+'/getUnmappedTeams');
  }
 

  errorHandler(error:Response){
  	return Observable.throw(error);
  }

}
