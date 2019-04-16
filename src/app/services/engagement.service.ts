import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { GlobalService } from '../global.service';
import { Constants } from '../utility/constants';
import { Engagement } from '../models/engagement.model';

@Injectable()
export class EngagementService {
  
  private baseUrl:string=Constants.BASE_URL+'/engagement';

  constructor(private _http:HttpClient) { }
 
  private engId: string;
  getEngagements(page:number){
    	return this._http.get(this.baseUrl+'/getAllEngagements?page=' +page);
  }

  getEngagementByID(engagmentId:String){
    return this._http.get<Engagement>(this.baseUrl+'/id/' +engagmentId);
}

  getCustomers(){
   return this._http.get(this.baseUrl+'/getAllCustomers');
  }

  createEngagement(engagementObj:any) {
    return this._http.post(this.baseUrl+'/createEngagement', engagementObj)
  }

  saveEngagement(engagementObj:any) {
    return this._http.put(this.baseUrl+'/saveEngagement', engagementObj)
  }

  getTeams(engagementId:string, pageTeam:number) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/team/getAllTeams?page=' +pageTeam);
  }

  getProducts(engagementId:string, pageProduct:number) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/getAllProducts?page=' + pageProduct);
  }

  getAllProductsNoPagination(engagementId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/product/getAvailableProducts');
  }

  getAvailableTeams(engagementId: string) {
    return this._http.get(this.baseUrl+'/'+engagementId+'/team/getAvailableTeams');
  }

  createTeam(teamObj:any, engagementId: string) {
    return this._http.post(this.baseUrl+'/'+engagementId+'/team/createTeam', teamObj);
  }

  createProduct(productObj:any, engagementId: string) {
    return this._http.post(this.baseUrl+'/'+engagementId+'/product/createProduct', productObj);
  }
   
  errorHandler(error:Response){
  	return Observable.throw(error);
  }

  getPager(totalItems: number, currentPage: number, pageSize: number) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize); 
    // console.log(totalPages);

    // ensure current page isn't out of range
    if (currentPage < 1) { 
        currentPage = 1; 
    } else if (currentPage > totalPages) { 
        currentPage = totalPages; 
    }
     
    let startPage: number, endPage: number;
    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}

}
