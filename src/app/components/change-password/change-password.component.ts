import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { AutoLogoutService } from '../../services/auto-logout.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userName: string;
  userDetails;
  securityQuestions;
  errorPasswordMessage: string = "none";
  errorSecurityMessage: string = "none";
  profileErrors:any;
  securityQuestion:string
  newPassword:string;
  confirmPassword:string;
  answer:string;
  errorMessage: string = "none";
  constructor(private userService: UserService, 
              private _profile: ProfileService,
              private autologoutService: AutoLogoutService) { }

  ngOnInit() {
    this.userName = sessionStorage.getItem("username");
    this.getUserByUserName(this.userName);
    this.getSecurityQuestions();
    this.securityQuestion = "0";
  }

  getUserByUserName(userName) {
    this.userService.getUserByUserName(userName).subscribe((data)=>{
      this.userDetails = data;
    })
  }
  getSecurityQuestions() {
    this.userService.getSecurityQuestions().subscribe((data)=>{
      this.securityQuestions = data; 
    })
  }

  updateProfile = function(profile) {
    this.profileErrors = "";
    this.displayPasswordToggle();
    this.displaySecurityToggle();
    this.profileObj = {
     "id": this.userDetails.id,
     "username": sessionStorage.getItem("username"),
     "newPassword": profile.newPassword != null ? profile.newPassword  : "",
     "confirmPassword": profile.confirmPassword != null ? profile.confirmPassword  : "",
     "securityQuestion": profile.securityQuestion != null ? profile.securityQuestion : "0",
     "answer": profile.answer != null ? profile.answer  : "",
     "currentPassword": profile.currentPassword  != null ? profile.currentPassword  : "",
   } 
   
   this.userService.changeUpdateProfile(this.profileObj).subscribe((data)=>{
        this._profile.setNewuserChangePassword(true);
        this.autologoutService.logout('false');
      },(error)=>{
        this.errorMessage = "block";
        this.errorPasswordMessage = "block";
        this.errorSecurityMessage = "block";
        this.profileErrors = error.error;
        this.newPassword = "";
        this.confirmPassword = "";
   });
 }


  displayPasswordToggle() {
    this.errorPasswordMessage = "none";
  }

  displaySecurityToggle() {
    this.errorSecurityMessage = "none";
  }

  displayToggle() {
    this.errorMessage = "none";
  }

}
