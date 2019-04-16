import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { Profile } from '../../models/profile.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //updateProfileMessage: string = "none";
  userName: string;
  showSideNav: boolean = false;
  userDetails;
  profileObj;
  profileErrors:any;
  userFirstName;
  securityQuestions;
  disableCutomerPassword:boolean = true;
  newPassword:string = "";
  confirmPassword:string = "";
  answer:string = "";
  securityQuestion:string = " ";
  currentPassword:string = "";
  errorPasswordMessage: string = "none";
  errorSecurityMessage: string = "none";
  profileTitle: string = "Profile";
  userHome: string = "User Home";
  isChangesUpdated: boolean = false;
  legendsLink: boolean = true;
  profilePageLanded: boolean = true;
  constructor(
    private _user: UserService,
    private _profile: ProfileService,
    private router:Router
  ) { }

  ngOnInit() {
    this.profileErrors = new Profile();
    this.userName = sessionStorage.getItem("username");
    this.getUserByUserName(sessionStorage.getItem("username"));
    this.getSecurityQuestions();
    this.profilePageLanded = true;
    window.scroll(0,0);
  }

  getUserByUserName(userName) {
    this._user.getUserByUserName(userName).subscribe((data)=>{
      this.userDetails = data;
      
    })
  }
  getSecurityQuestions() {
    this._user.getSecurityQuestions().subscribe((data)=>{
      this.securityQuestions = data;
      
    })
  }

  updateProfile = function(profile) {
    this.profileErrors = "";
    this.displayPasswordToggle();
    this.displaySecurityToggle();
    this.profileObj = {
     "id": this.userDetails.id,
     "newPassword": profile.newPassword,
     "confirmPassword": profile.confirmPassword,
     "securityQuestion": profile.securityQuestion == " " ? "0" : profile.securityQuestion,
     "answer": profile.answer,
     "currentPassword": profile.currentPassword
   } 
   
   this._user.updateProfile(this.profileObj).subscribe((data)=>{
        this.isChangesUpdated = true;
        this._profile.setProfileChangedStatus(this.isChangesUpdated);
        
        this.router.navigate(['/userHome']);
      },(error)=>{
      this.errorPasswordMessage = "block";
      this.errorSecurityMessage = "block";
      this.profileErrors = error.error;
      this.newPassword = "";
      this.confirmPassword = "";
      this.currentPassword = "";
      this.isChangesUpdated = false;
      console.log(error);
   });


 }

 onChange() {
   if((this.newPassword.length > 0 && this.confirmPassword.length > 0 && this.currentPassword.length > 0) || (this.securityQuestion != " " && this.answer.length > 0 && this.currentPassword.length > 0)) {
    this.disableCutomerPassword = false;
   } else {
    this.disableCutomerPassword = true;
   }
   
 }

  displayPasswordToggle() {
    this.errorPasswordMessage = "none";
  }

  displaySecurityToggle() {
    this.errorSecurityMessage = "none";
  }
}
