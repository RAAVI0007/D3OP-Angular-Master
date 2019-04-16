import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalService } from '../global.service';
import { Constants } from '../utility/constants';

@Injectable()
export class PersonService {

  private baseUrl:string=Constants.BASE_URL+'/user';
 

  constructor(
              private _http:HttpClient
            ) { }

            
  getAllStrategists() {
    return this._http.get(this.baseUrl+'/getAllStrategists');
  }

  findAllAdmins(){
    return this._http.get(this.baseUrl+'/findAllAdmins');
  }

  saveAdminDetails(userID : number) {
   // alert("URL" + this.baseUrl+"/"+userID+"/saveDefaultAdmin");
     return this._http.post(this.baseUrl+"/"+userID+"/saveDefaultAdmin",null) ;
  }
}
