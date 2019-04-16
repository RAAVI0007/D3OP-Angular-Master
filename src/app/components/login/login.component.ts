import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string = this.cookieService.check('rememberMe') ? this.cookieService.get('username') : '';
  password:string;
  user: User = new User();
  rememberMe:boolean = this.cookieService.check('rememberMe');
  errorMessage: string = "none";
  message: string = "none";
  userObj:Object = {};
  status: number = 200;
  email:string = "";
  forgotError:any;
  headerImage:string = "./assets/images/TM-Benchmark.png";
  footerImage:string = "./assets/images/benchmark.png";
  securitySuccessMessage:string = 'none';
  sessionExpired:string = 'none';
  forgotPasswordSuccessMessage: String = 'none';
  loggedInUserUpdatedSuccessMessage: String = "none";
  cookieUserName: string;
  constructor(
    private router: Router, 
    private _profile: ProfileService,
    private _userService: UserService,
    private auth: AuthService,
    private cookieService: CookieService
  ) {}

    ngOnInit() {
      this.sessionExpired = 'none';
      if(sessionStorage.getItem("timeout") === "true")  {
        this.sessionExpired = 'block';
        sessionStorage.removeItem("timeout");
      }

      if(this._profile.getProfileChangedStatus()) {
        this.securitySuccessMessage = "block";
        setTimeout(()=>{ 
          this.securitySuccessMessage = "none";
          this._profile.setProfileChangedStatus(false);
        }, 10000);
      }

      if(this._profile.getNewuserChangePassword()) {
        this.forgotPasswordSuccessMessage = "block";
        setTimeout(()=>{ 
          this.forgotPasswordSuccessMessage = "none";
          this._profile.setNewuserChangePassword(false);
        }, 10000);
      }

      if(this._userService.getForgotPasswordChanged()){
        this.forgotPasswordSuccessMessage = "block";
        setTimeout(()=>{ 
          this.forgotPasswordSuccessMessage = "none";
          this._userService.setForgotPasswordChanged(false);
        }, 10000);
      }      

      if(this._userService.getLoggedInAccountUpdate()) {
        this.loggedInUserUpdatedSuccessMessage = "block";
        setTimeout(()=>{ 
          this.loggedInUserUpdatedSuccessMessage = "none";
          this._userService.setLoggedInAccountUpdate(false);
        }, 10000);
      }

    }
    
  login = function(user) {
    this.userObj = {
     "username": user.username,
     "password": user.password
    }
    
    this.auth.login(this.userObj).then((user) => {
      if(user.status == 200) {
        sessionStorage.setItem("token", user.json().token);
        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("username", this.userObj.username);
        sessionStorage.setItem("role", user.json().role);
        sessionStorage.setItem("oldBmMessageDisplayed", "no");

        if(user.json().role === 'ROLE_NEW_USER')
          this.router.navigateByUrl('/changePassword');   
        else
          this.router.navigateByUrl('/userHome');
      } else {
        this.status = user.status;
        this.errorMessage = "block";
      }
      this.cookieUserName = this.userObj.username;
      this.setCookies();
    },(error)=>{
      this.status = user.status;
      this.errorMessage = "block";
    });
  }

  forgotPassword = function(forgot) {
    this.auth.forgotPassword(forgot.email).subscribe((data)=>{
      this.closeForgotPasswordModel();
      this.router.navigate(["/securityQuestion/"+data.email]);
      setTimeout(()=>{ 
        
      }, 10000);
     },(error)=>{
      this.forgotError = error.error;
  });
}

closeForgotPasswordModel() {
  let element = document.getElementById("close-forgotPassword") as any;
  element.click();
}

forgotPasswordDefaults() {
  this.forgotError = "";
  this.email = "";
}
  
  login1(): void {
    this.auth.login(this.user).then((user) => {
      sessionStorage.setItem('token', user.json().Authorization);
      sessionStorage.setItem('username', this.username);
      this.router.navigateByUrl('/userHome');
    })
    .catch((err) => {
      this.status = err.status;
      this.errorMessage = "block";
    });
  }



  displayToggle() {
    this.errorMessage = "none";
    this.status = 200;
  }

  setCookies() {
    if(this.rememberMe) {
      this.cookieService.set('rememberMe', this.rememberMe.toString());
      this.cookieService.set('username', this.cookieUserName);
      this.password = '';
    } else {
      this.password = '';
      this.username = '';
      this.cookieService.delete( 'rememberMe');
      this.cookieService.delete( 'username' );
    }
  } 
}