import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.css']
})
export class SecurityQuestionComponent implements OnInit {
  email:string;
  error:any;
  person:any;
  answer:string = "";
  securityError:any;
  navBarBrandLogo = "../../../assets/images/TM-Benchmark.png";
  
  constructor(private auth: AuthService,
              private _profile: ProfileService,
              private router:Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.email = params.email;
     
    });
    this.auth.forgotPassword(this.email).subscribe((data)=>{
      this.person = data;
    },(error)=>{
      this.error = error.error;
    });
  }

  validateQuestion = function(security) {
      this.securityObject = { 
        "id":this.person.id,
        "answer" : security.answer
      }
      this.auth.validateAnswer(this.securityObject).subscribe((data)=>{
        this._profile.setProfileChangedStatus(true);
        this.router.navigate(['/']);
        setTimeout(()=>{ 
         
        }, 10000);
      },(error)=>{
      this.securityError = error.error;
   });

 }

}
