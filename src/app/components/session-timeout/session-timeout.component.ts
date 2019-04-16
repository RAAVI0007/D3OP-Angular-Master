import { OnInit, Component } from "@angular/core";
import { AutoLogoutService } from "../../services/auto-logout.service";

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.css']
})
export class SessionTimeoutComponent implements OnInit {

  constructor(private autoLogoutService:AutoLogoutService) {

  }
  ngOnInit() {
    this.autoLogoutService.ngOnDestroy();
    this.autoLogoutService.ngOnInit();
  }

  logout(condition:string) {
    this.autoLogoutService.logout(condition);
  }

  extendSession() {
    this.autoLogoutService.extendSession().subscribe((data)=>{
    },(error)=>{
    });
  }
}
