import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalService } from '../global.service';
import { Constants } from '../utility/constants';
import { User } from '../models/user';

@Injectable()
export class UserService {

  private baseUrl:string=Constants.BASE_URL+'/user';
  private changed;
  private userUpdated;

  constructor(
    private _http:HttpClient
  ) { }

  getUserByUserName(userName) {
    return this._http.get(this.baseUrl+'/'+userName+'/getUserByUserName');
  }

  getSecurityQuestions() {
    return this._http.get(this.baseUrl+'/getSecurityQuestions');
  }

  updateProfile(profileObj:any) {
    return this._http.put(this.baseUrl+'/updatePassword', profileObj);
  }

  updateForgotPassword(forgotPasswordObj:any) {
    return this._http.put(Constants.BASE_URL+'/token/updateForgotPassword', forgotPasswordObj);
  }

  getUserByForgotPasswordString(forgotPasswordString:String) {
    return this._http.get(Constants.BASE_URL+'/token/resetPassword?token='+forgotPasswordString);
  }

  setForgotPasswordChanged(changed: boolean) {
    this.changed = changed;
  }

  getForgotPasswordChanged() {
    return this.changed;
  }


  changeUpdateProfile(profileObj:any) {
    return this._http.put(this.baseUrl+'/changeUpdatePassword', profileObj);
  }


  getAllUsersInPagination(page:number) {
    return this._http.get(this.baseUrl+'/getAllUsersInPagination?page=' +page);
  }

  createUser(userObj: User) {
    return this._http.post(this.baseUrl+'/createUser', userObj);
  }

  getRoleTypeByUserName(userName:String) {
    return this._http.get(this.baseUrl+'/'+userName+'/getUserByUserName');
  }

  saveUser(userObj: User) {
    return this._http.put(this.baseUrl+'/saveUser', userObj);
  }

  getLoggedInAccountUpdate() {
    return this.userUpdated;
  }

  setLoggedInAccountUpdate(userUpdated: boolean) {
    this.userUpdated = userUpdated;
  }

  deleteUser(userName) {
    return this._http.delete(this.baseUrl+'/'+userName+'/deletePersonByUserName');
  }

}