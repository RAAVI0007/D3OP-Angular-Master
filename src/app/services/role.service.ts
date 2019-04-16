import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../utility/constants';

@Injectable()
export class RoleService {

  private baseUrl:string=Constants.BASE_URL+'/role';

  constructor(private _http:HttpClient) { }

  getRoleIdByRoleName(roleName: String) {
    return this._http.get(this.baseUrl+'/'+roleName+'/getRoleId');
  }

  getAllRoleIdAndName() {
    return this._http.get(this.baseUrl+'/getAllRoleIdAndName');
  }
}
