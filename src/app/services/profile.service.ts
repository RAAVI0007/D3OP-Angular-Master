import { Injectable } from '@angular/core';

export class ProfileService {
  changed: boolean;

  newuserChangePassword: boolean
  constructor() { }

  getProfileChangedStatus() {
    return this.changed;
  }

  setProfileChangedStatus(changed: boolean) {
    this.changed = changed;
 }

 getNewuserChangePassword() {
  return this.newuserChangePassword;
  }

setNewuserChangePassword(newuserChangePassword: boolean) {
  this.newuserChangePassword = newuserChangePassword;
}

}
