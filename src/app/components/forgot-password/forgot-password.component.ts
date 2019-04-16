import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  
  forgotPassword;
  userName: string;
  userDetail;
  forgotPasswordObj;
  newPassword: string = "";
  confirmPassword: string = "";
  pageFound: boolean = true;
  ForgotPasswordErrors;
  errorForgotPasswordMessage: String = 'none';

  constructor(
    private activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.forgotPassword = params.forgotPassword;
      
    });
    console.log(this.forgotPassword);
    this.getUserByForgotPasswordString(this.forgotPassword);
    this.userName = sessionStorage.getItem("username");

  }

  getUserByForgotPasswordString(forgotPasswordString:String) {
    this._userService.getUserByForgotPasswordString(forgotPasswordString).subscribe((data)=>{
      this.userDetail = data;
      console.log(this.userDetail);
    }, (error)=>{
      console.log(error.status);
      if(error.status === 404) {
        this.pageFound = false;
      } else {
        this.pageFound = true;
      }
    });
  }

  updateForgotPassword(forgotPassword) {
    this.forgotPasswordObj = {
      "id": this.userDetail.id,
      "currentPassword": this.userDetail.password,
      "newPassword": forgotPassword.newPassword,
      "confirmPassword": forgotPassword.confirmPassword,
      "securityQuestion": "0"
    }
    console.log(this.forgotPasswordObj);

    this._userService.updateForgotPassword(this.forgotPasswordObj).subscribe((data)=>{
      console.log(data);
      console.log('Done');
      this._userService.setForgotPasswordChanged(true);
      this._router.navigate(['']);
    }, (error)=>{
      console.log(error);
      this.ForgotPasswordErrors = error.error;
      this.errorForgotPasswordMessage = "block";
    });
  }

  displayPasswordToggle() {
    this.errorForgotPasswordMessage = "none";
  }

}
