import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { LeftNavigationService } from '../../services/left-navigation.service';
import { features } from '../../utility/features'

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() userName: string;
  @Output() leftNavigationBarStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() teamDetailsSubArea = new EventEmitter<string>();
  @Output() productDetailsSubArea = new EventEmitter<string>();
  isNewUser:boolean;
  sideNavStatus: string =  "collapsed";
  features: any;

  roleTypeName: string;
  isAdmin:boolean = false;
  navigationData;
  engagementId;
  teamId;
  productId;
  pageUrl;
  sideNavRender: boolean;
  navBarBrandLogo = "./assets/images/TM-Benchmark.png";

  public scrollbarOptions = { 
      axis: 'y', 
      theme: 'light-3', 
      autoHideScrollbar: 'true', 
      scrollbarPosition: 'inside'
  };

  constructor(
    private router: Router,
    private autoLogoutService:AutoLogoutService,
    private _leftNavigation: LeftNavigationService,
    private _userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.features = features;
  }

  ngOnInit() {
    let role = sessionStorage.getItem('role');
    this.isNewUser = role === 'ROLE_NEW_USER' ? false : true;
    if(role === "ROLE_ADMIN")
        this.isAdmin = true;
    else
      this.isAdmin = false;
    
    this.pageUrl = this.router.url;  
  
    this.activatedRoute.params.subscribe(params => {  
      this.engagementId = params.engagementId;
      this.teamId = params.teamId;
      this.productId = params.productId;
    });

    if(this.sideNavShowHide())
      this.getAllEngagementsWithTeamAndProducts(); 
    
    document.getElementById("home-icon-panel").style.width = "0px";
    document.getElementById("home-icon-panel").style.display = "none";  
    document.getElementById("sidenav").style.width = "0px";
    document.getElementById("sidenav").style.display = "none";
  
    if(!this.sideNavShowHide()) {
      document.getElementById("sidenav").style.width = "0px";
      document.getElementById("sidenav").style.display = "none";
      document.getElementById("home-icon-panel").style.width = "0px";
      document.getElementById("home-icon-panel").style.display = "none";
    }
    
    if(this.engagementId == undefined && this.teamId == undefined && this.productId == undefined) {
      document.getElementById("user-home-icon").style.color = "#ff404b";
      document.getElementById("user-home-link").style.borderBottomColor = "#ff404b";
      this.userHomeNavDefault();
    }

    if(this.engagementId != undefined && this.teamId == undefined && this.productId == undefined) {
      this.dashboardNavDefault();
      document.getElementById("user-home-icon").style.color = "#ffffff";
      document.getElementById("user-home-link").style.borderBottomColor = "#ffffff";
    }

    if(this.engagementId != undefined && this.teamId != undefined && this.productId == undefined) {
      this.teamPageNavDefault();
      document.getElementById("user-home-icon").style.color = "#ffffff";
      document.getElementById("user-home-link").style.borderBottomColor = "#ffffff";
    }

    if(this.engagementId != undefined && this.teamId == undefined && this.productId != undefined) {
      this.productPageNavDefault();
      document.getElementById("user-home-icon").style.color = "#ffffff";
      document.getElementById("user-home-link").style.borderBottomColor = "#ffffff";
    }
  }

  toggleSideNav() {
    if(this.sideNavStatus ===  "collapsed") {
      document.getElementById("sidenav").style.display = "block";
      document.getElementById("sidenav").style.width = "200px";
      this.sideNavStatus = "expanded";
      document.getElementById("home-icon-panel").style.width = "200px";
      document.getElementById("home-icon-panel").style.display = "block";  
      let breadcrumbElement = document.getElementById("breadcrumb-container");
      breadcrumbElement.className = breadcrumbElement.className.replace("container", "container-fluid");
      let mainContainerElement = document.getElementById("main-container");
      mainContainerElement.className = mainContainerElement.className.replace("container", "container-fluid");
      document.getElementById('wrapper').style.marginLeft = "200px";
    } else if(this.sideNavStatus ===  "expanded") {
        document.getElementById("sidenav").style.display = "none";
        document.getElementById("sidenav").style.width = "0px";
        this.sideNavStatus = "collapsed";
        document.getElementById("home-icon-panel").style.width = "0px";
        document.getElementById("home-icon-panel").style.display = "none";
        document.getElementById('wrapper').style.marginLeft = "0px";
        let breadcrumbElement = document.getElementById("breadcrumb-container");
        let mainContainerElement = document.getElementById("main-container");
        breadcrumbElement.className = breadcrumbElement.className.replace("container-fluid", "container");
        mainContainerElement.className = mainContainerElement.className.replace("container-fluid", "container");
    } else if(!this.sideNavShowHide()) {
      document.getElementById("sidenav").style.display = "none";
      document.getElementById("sidenav").style.width = "0px";
      document.getElementById("home-icon-panel").style.width = "0px";
      document.getElementById("home-icon-panel").style.display = "none";
      document.getElementById('wrapper').style.marginLeft = "0px";
      let breadcrumbElement = document.getElementById("breadcrumb-container");
      let mainContainerElement = document.getElementById("main-container");
      breadcrumbElement.className = breadcrumbElement.className.replace("container-fluid", "container");
      mainContainerElement.className = mainContainerElement.className.replace("container-fluid", "container");
    }
    sessionStorage.setItem("sessionSideNavStatus", this.sideNavStatus);
  }

  goToUserHome() {
    document.getElementById("user-home-icon").style.color = "#ff404b";
  }

  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  getAllEngagementsWithTeamAndProducts() {
    this._leftNavigation.getAllEngagementsWithTeamAndProducts().subscribe((data)=>{
      this.navigationData = data;
      let localStorageEngagementMenuToggleStatusData = JSON.parse(localStorage.getItem("localStorageEngagementMenuToggleStatus"));
      let localStorageEngagementActiveStatusData = JSON.parse(localStorage.getItem("localStorageEngagementActiveStatus"));
      let localStorageEngagementDashboardHeadingData = JSON.parse(localStorage.getItem("localStorageEngagementDashboardHeadingStatus"));
      let localStorageEngagementTeamHeadingStatusData = JSON.parse(localStorage.getItem("localStorageEngagementTeamHeadingStatus"));
      let localStorageEngagementProductHeadingStatusData = JSON.parse(localStorage.getItem("localStorageEngagementProductHeadingStatus"));
      let localStorageEngagementTeamDivStatusData = JSON.parse(localStorage.getItem("localStorageEngagementTeamDivStatus"));
      let localStorageEngagementProductDivStatusData = JSON.parse(localStorage.getItem("localStorageEngagementProductDivStatus"));
      let localStorageTeamSelectedStatusData = JSON.parse(localStorage.getItem("localStorageTeamSelectedStatus"));
      let localStorageProductSelectedStatusData = JSON.parse(localStorage.getItem("localStorageProductSelectedStatus"));
      let k = 0;
      let l = 0;
      for(let i=0; i<this.navigationData.length; i++) {
        if(localStorageEngagementMenuToggleStatusData == null) {
          this.addKeyValue(this.navigationData[i], "engagementMenuToggleStatus", "collapse");
        } else if (localStorageEngagementMenuToggleStatusData != null) {
          this.addKeyValue(this.navigationData[i], "engagementMenuToggleStatus", localStorageEngagementMenuToggleStatusData[i]);
        }
        if(localStorageEngagementActiveStatusData == null) {
          this.addKeyValue(this.navigationData[i], "engagementActiveStatus", "eng-inactive");  
        } else if(localStorageEngagementActiveStatusData != null) {
          this.addKeyValue(this.navigationData[i], "engagementActiveStatus", localStorageEngagementActiveStatusData[i]);  
        }
        if(localStorageEngagementDashboardHeadingData == null) {
          this.addKeyValue(this.navigationData[i], "engagementDashboardHeadingStatus", "dash-inactive");
        } else if(localStorageEngagementDashboardHeadingData != null) {
          this.addKeyValue(this.navigationData[i], "engagementDashboardHeadingStatus", localStorageEngagementDashboardHeadingData[i]);
        }
        if(localStorageEngagementTeamHeadingStatusData == null) {
          this.addKeyValue(this.navigationData[i], "engagementTeamHeadingStatus", "team-inactive");
        } else if(localStorageEngagementTeamHeadingStatusData != null) {
          this.addKeyValue(this.navigationData[i], "engagementTeamHeadingStatus", localStorageEngagementTeamHeadingStatusData[i]);
        }
        if(localStorageEngagementTeamDivStatusData == null) {
          this.addKeyValue(this.navigationData[i], "engagementTeamDivStatus", "collapse");
        } else if (localStorageEngagementTeamDivStatusData != null) {
          this.addKeyValue(this.navigationData[i], "engagementTeamDivStatus", localStorageEngagementTeamDivStatusData[i]);
        }
        if(localStorageEngagementProductHeadingStatusData == null) {
          this.addKeyValue(this.navigationData[i], "engagementProductHeadingStatus", "product-inactive");
        } else if(localStorageEngagementProductHeadingStatusData != null) {
          this.addKeyValue(this.navigationData[i], "engagementProductHeadingStatus", localStorageEngagementProductHeadingStatusData[i]);
        }
        if(localStorageEngagementProductDivStatusData == null) {
          this.addKeyValue(this.navigationData[i], "engagementProductDivStatus", "collapse");
        } else if (localStorageEngagementProductDivStatusData != null) {
          this.addKeyValue(this.navigationData[i], "engagementProductDivStatus", localStorageEngagementProductDivStatusData[i]);
        }
        if(localStorageTeamSelectedStatusData == null) {
          if(this.navigationData[i].teams != null) {
            for(let j=0; j<this.navigationData[i].teams.length; j++) {
              this.addKeyValue(this.navigationData[i].teams[j], "teamSelectedStatus", "team-not-selected");
            }
          }
        } else if(localStorageTeamSelectedStatusData != null) {
          if(this.navigationData[i].teams != null) {
            for(let j=0; j<this.navigationData[i].teams.length; j++) {
              this.addKeyValue(this.navigationData[i].teams[j], "teamSelectedStatus", localStorageTeamSelectedStatusData[k]);
              k++;
            }
          }
        }
        if(localStorageProductSelectedStatusData == null) {
          if(this.navigationData[i].products != null) {
            for(let j=0; j<this.navigationData[i].products.length; j++) {
              this.addKeyValue(this.navigationData[i].products[j], "productSelectedStatus", "product-not-selected");
            }
          }
        } else if(localStorageProductSelectedStatusData != null) {
          if(this.navigationData[i].products != null) {
            for(let j=0; j<this.navigationData[i].products.length; j++) {
              this.addKeyValue(this.navigationData[i].products[j], "productSelectedStatus", localStorageProductSelectedStatusData[l]);
              l++;
            }
          }
        }
      }
    }, (error) => {
    })
  }

  engagementHeadingToggle(index, navLength) {
    for(let i=0; i<navLength; i++) {
      if(this.navigationData[index].engagementId != this.navigationData[i].engagementId)
        this.navigationData[i].engagementMenuToggleStatus = "collapse";
        this.navigationData[i].engagementActiveStatus = "eng-inactive";
    }
    if(this.navigationData[index].engagementMenuToggleStatus === "collapse") {
      this.navigationData[index].engagementMenuToggleStatus = "collapse in";
      this.navigationData[index].engagementActiveStatus = "eng-active"
    }
      
    else if (this.navigationData[index].engagementMenuToggleStatus === "collapse in") {
      this.navigationData[index].engagementMenuToggleStatus = "collapse";
      this.navigationData[index].engagementActiveStatus = "eng-inactive"
    }
    let engagementMenuToggleStatusArray = [];
    let engagementActiveStatusArray = [];
    for(let i=0; i<navLength; i++) {
      engagementMenuToggleStatusArray[i] = this.navigationData[i].engagementMenuToggleStatus;
      engagementActiveStatusArray[i] = this.navigationData[i].engagementActiveStatus;
    }
    localStorage.setItem("localStorageEngagementMenuToggleStatus", JSON.stringify(engagementMenuToggleStatusArray));
    localStorage.setItem("localStorageEngagementActiveStatus", JSON.stringify(engagementActiveStatusArray));
    
  }

  setDashboardHeadingLinkActive(index, navLength) {
    for(let i=0; i<navLength; i++) {
      this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
      this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
      this.navigationData[i].engagementTeamDivStatus = "collapse";
      this.navigationData[i].engagementProductDivStatus = "collapse";
      this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
    }
    for(let i=0; i<navLength; i++) {
      if(this.navigationData[i].products != null) {
        for(let j=0; j<this.navigationData[i].products.length; j++) {
          this.navigationData[i].products[j].productSelectedStatus = "product-not-selected";
        }
      }
    }
    for(let i=0; i<navLength; i++) {
      if(this.navigationData[i].teams != null) {
        for(let j=0; j<this.navigationData[i].teams.length; j++) {
          this.navigationData[i].teams[j].teamSelectedStatus = "team-not-selected";
        }
      }
    }
    this.navigationData[index].engagementDashboardHeadingStatus = "dash-active";
    let engagementDashboardHeadingStatusArray = [];
    let engagementTeamHeadingStatusArray = [];
    let engagementProductHeadingStatusArray = [];
    let teamSelectedStatusArray = [];
    let productSelectedStatusArray = [];
    let engagementTeamDivStatusArray = [];
    let engagementProductDivStatusArray = [];
    let k = 0;
    for(let i=0; i<navLength; i++) {
      engagementDashboardHeadingStatusArray[i] = this.navigationData[i].engagementDashboardHeadingStatus;
      engagementTeamHeadingStatusArray[i] = this.navigationData[i].engagementTeamHeadingStatus;
      engagementProductHeadingStatusArray[i] = this.navigationData[i].engagementProductHeadingStatus;
      engagementTeamDivStatusArray[i] = this.navigationData[i].engagementTeamDivStatus;
      engagementProductDivStatusArray[i] = this.navigationData[i].engagementProductDivStatus;
    }
    for(let i=0; i<navLength; i++) {
      if(this.navigationData[i].teams != null) {
        for(let j=0; j<this.navigationData[i].teams.length; j++) {
          teamSelectedStatusArray[k] = this.navigationData[i].teams[j].teamSelectedStatus;
          k++;
        }
      }
      if(this.navigationData[i].products != null) {
        for(let j=0; j<this.navigationData[i].products.length; j++) {
          productSelectedStatusArray[i] = this.navigationData[i].products[j].productSelectedStatus;
        }
      }
    }
    localStorage.setItem("localStorageEngagementTeamDivStatus", JSON.stringify(engagementTeamDivStatusArray));
    localStorage.setItem("localStorageEngagementProductDivStatus", JSON.stringify(engagementProductDivStatusArray));
    localStorage.setItem("localStorageEngagementDashboardHeadingStatus", JSON.stringify(engagementDashboardHeadingStatusArray));
    localStorage.setItem("localStorageEngagementTeamHeadingStatus", JSON.stringify(engagementTeamHeadingStatusArray));
    localStorage.setItem("localStorageEngagementProductHeadingStatus", JSON.stringify(engagementProductHeadingStatusArray));
    localStorage.setItem("localStorageTeamSelectedStatus", JSON.stringify(teamSelectedStatusArray));
    localStorage.setItem("localStorageProductSelectedStatus", JSON.stringify(productSelectedStatusArray));

    document.getElementById("sidenav").style.display = "none";
    document.getElementById("sidenav").style.width = "0px";
    document.getElementById("home-icon-panel").style.width = "0px";
    document.getElementById("home-icon-panel").style.display = "none";
    
    this.sideNavStatus = "collapsed";
    document.getElementById('wrapper').style.marginLeft = "0px";
    let breadcrumbElement = document.getElementById("breadcrumb-container");
    let mainContainerElement = document.getElementById("main-container");
    breadcrumbElement.className = breadcrumbElement.className.replace("container-fluid", "container");
    mainContainerElement.className = mainContainerElement.className.replace("container-fluid", "container");
  }

  setTeamHeadingLinkActive(index, navLength) {
    if(this.navigationData[index].teams != null) {
      for(let i=0; i<navLength; i++) {
        this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
        this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
        this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
        this.navigationData[i].engagementProductDivStatus = "collapse";
        if(this.navigationData[i].engagementId != this.navigationData[index].engagementId) {
          this.navigationData[i].engagementTeamDivStatus = "collapse";
        }
      }
      this.navigationData[index].engagementTeamHeadingStatus = "team-active";
      if(this.navigationData[index].engagementTeamDivStatus === "collapse in") {
        this.navigationData[index].engagementTeamHeadingStatus = "team-inactive";
        this.navigationData[index].engagementTeamDivStatus = "collapse";
      }
        
      else if(this.navigationData[index].engagementTeamDivStatus === "collapse")  
        this.navigationData[index].engagementTeamDivStatus = "collapse in";
  
      let engagementDashboardHeadingStatusArray = [];
      let engagementTeamHeadingStatusArray = [];
      let engagementProductHeadingStatusArray = [];  
      let engagementTeamDivStatusArray = [];
      let engagementProductDivStatusArray = [];
  
      for(let i=0; i<navLength; i++) {
        engagementDashboardHeadingStatusArray[i] = this.navigationData[i].engagementDashboardHeadingStatus;
        engagementTeamHeadingStatusArray[i] = this.navigationData[i].engagementTeamHeadingStatus;
        engagementProductHeadingStatusArray[i] = this.navigationData[i].engagementProductHeadingStatus;
        engagementTeamDivStatusArray[i] = this.navigationData[i].engagementTeamDivStatus;
        engagementProductDivStatusArray[i] = this.navigationData[i].engagementProductDivStatus;
      }
  
      localStorage.setItem("localStorageEngagementDashboardHeadingStatus", JSON.stringify(engagementDashboardHeadingStatusArray));
      localStorage.setItem("localStorageEngagementTeamHeadingStatus", JSON.stringify(engagementTeamHeadingStatusArray));
      localStorage.setItem("localStorageEngagementProductHeadingStatus", JSON.stringify(engagementProductHeadingStatusArray));
      localStorage.setItem("localStorageEngagementTeamDivStatus", JSON.stringify(engagementTeamDivStatusArray));
      localStorage.setItem("localStorageEngagementProductDivStatus", JSON.stringify(engagementProductDivStatusArray));
    }
    
  }

  setProductHeadingLinkActive(index, navLength) {
    if(this.navigationData[index].products != null) {
      for(let i=0; i<navLength; i++) {
        this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
        this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
        this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
        this.navigationData[i].engagementTeamDivStatus = "collapse";
        if(this.navigationData[i].engagementId != this.navigationData[index].engagementId) {
          this.navigationData[i].engagementProductDivStatus = "collapse";
        }
      }
      this.navigationData[index].engagementProductHeadingStatus = "product-active";
      if(this.navigationData[index].engagementProductDivStatus === "collapse in") {
        this.navigationData[index].engagementProductHeadingStatus = "product-inactive";
        this.navigationData[index].engagementProductDivStatus = "collapse";
      }
      else if(this.navigationData[index].engagementProductDivStatus === "collapse")   
        this.navigationData[index].engagementProductDivStatus = "collapse in";
  
      let engagementDashboardHeadingStatusArray = [];
      let engagementTeamHeadingStatusArray = [];
      let engagementProductHeadingStatusArray = [];  
      let engagementTeamDivStatusArray = [];
      let engagementProductDivStatusArray = [];  
  
      for(let i=0; i<navLength; i++) {
        engagementDashboardHeadingStatusArray[i] = this.navigationData[i].engagementDashboardHeadingStatus;
        engagementTeamHeadingStatusArray[i] = this.navigationData[i].engagementTeamHeadingStatus;
        engagementProductHeadingStatusArray[i] = this.navigationData[i].engagementProductHeadingStatus;
        engagementTeamDivStatusArray[i] = this.navigationData[i].engagementTeamDivStatus;
        engagementProductDivStatusArray[i] = this.navigationData[i].engagementProductDivStatus;
      }
  
      localStorage.setItem("localStorageEngagementDashboardHeadingStatus", JSON.stringify(engagementDashboardHeadingStatusArray));
      localStorage.setItem("localStorageEngagementTeamHeadingStatus", JSON.stringify(engagementTeamHeadingStatusArray));
      localStorage.setItem("localStorageEngagementProductHeadingStatus", JSON.stringify(engagementProductHeadingStatusArray));
      localStorage.setItem("localStorageEngagementTeamDivStatus", JSON.stringify(engagementTeamDivStatusArray));
      localStorage.setItem("localStorageEngagementProductDivStatus", JSON.stringify(engagementProductDivStatusArray));
    }
  }

  setCurrentTeamActive(index1, index2, navLength) {
    for(let i=0; i<navLength; i++) {
      this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
      this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
      if(this.navigationData[i].teams != null) {
        for(let j=0; j<this.navigationData[i].teams.length; j++) {
          this.navigationData[i].teams[j].teamSelectedStatus = "team-not-selected";
          if(this.navigationData[i].teams[j].id === this.navigationData[index1].teams[index2].id) {
            this.navigationData[i].teams[j].teamSelectedStatus = "team-selected";  
          }
        }
      }
      if(this.navigationData[i].products != null) {
        for(let j=0; j<this.navigationData[i].products.length; j++) {
          this.navigationData[i].products[j].productSelectedStatus = "product-not-selected";
        }
      }
    }
    this.navigationData[index1].engagementTeamHeadingStatus = "team-active";
    let engagementTeamHeadingStatusArray = [];
    let teamSelectedStatusArray = [];
    let productSelectedStatusArray = [];
    let engagementDashboardHeadingStatusArray = [];
    let k = 0;
    let l = 0;
    for(let i=0; i<navLength; i++) {
      engagementDashboardHeadingStatusArray[i] = this.navigationData[i].engagementDashboardHeadingStatus;
      engagementTeamHeadingStatusArray[i] = this.navigationData[i].engagementTeamHeadingStatus;
      if(this.navigationData[i].teams != null) {
        for(let j=0; j<this.navigationData[i].teams.length; j++) {
          teamSelectedStatusArray[k] = this.navigationData[i].teams[j].teamSelectedStatus;
          k++;
        }
      }
      if(this.navigationData[i].products != null) {
        for(let j=0; j<this.navigationData[i].products.length; j++) {
          productSelectedStatusArray[l] = this.navigationData[i].products[j].productSelectedStatus;
          l++;
        }
      }
    }
    localStorage.setItem("localStorageEngagementDashboardHeadingStatus", JSON.stringify(engagementDashboardHeadingStatusArray));
    localStorage.setItem("localStorageTeamSelectedStatus", JSON.stringify(teamSelectedStatusArray));
    localStorage.setItem("localStorageProductSelectedStatus", JSON.stringify(productSelectedStatusArray));
    localStorage.setItem("localStorageEngagementTeamHeadingStatus", JSON.stringify(engagementTeamHeadingStatusArray));
    document.getElementById("sidenav").style.display = "none";
    document.getElementById("sidenav").style.width = "0px";
    document.getElementById("home-icon-panel").style.width = "0px";
    document.getElementById("home-icon-panel").style.display = "none";
    
    this.sideNavStatus = "collapsed";
    document.getElementById('wrapper').style.marginLeft = "0px";
    let breadcrumbElement = document.getElementById("breadcrumb-container");
    let mainContainerElement = document.getElementById("main-container");
    breadcrumbElement.className = breadcrumbElement.className.replace("container-fluid", "container");
    mainContainerElement.className = mainContainerElement.className.replace("container-fluid", "container");

    this.teamDetailsSubArea.emit();
  }

  setCurrentProductActive(index1, index2, navLength) {
    for(let i=0; i<navLength; i++) {
      this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
      this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
      if(this.navigationData[i].products != null) {
        for(let j=0; j<this.navigationData[i].products.length; j++) {
          this.navigationData[i].products[j].productSelectedStatus = "product-not-selected";
          if(this.navigationData[i].products[j].id === this.navigationData[index1].products[index2].id) {
            this.navigationData[i].products[j].productSelectedStatus = "product-selected";
          }
        }
      }
      if(this.navigationData[i].teams != null) {
        for(let j=0; j<this.navigationData[i].teams.length; j++) {
          this.navigationData[i].teams[j].teamSelectedStatus = "team-not-selected";
        }
      }
    }
    this.navigationData[index1].engagementProductHeadingStatus = "product-active";
    let engagementProductHeadingStatusArray = [];
    let teamSelectedStatusArray = [];
    let productSelectedStatusArray = [];
    let engagementDashboardHeadingStatusArray = [];
    let k = 0;
    let l = 0;
    for(let i=0; i<navLength; i++) {
      engagementDashboardHeadingStatusArray[i] = this.navigationData[i].engagementDashboardHeadingStatus;
      engagementProductHeadingStatusArray[i] = this.navigationData[i].engagementProductHeadingStatus;
      if(this.navigationData[i].teams != null) {
        for(let j=0; j<this.navigationData[i].teams.length; j++) {
          teamSelectedStatusArray[k] = this.navigationData[i].teams[j].teamSelectedStatus;
          k++;
        }
      }
      if(this.navigationData[i].products != null) {
        for(let j=0; j<this.navigationData[i].products.length; j++) {
          productSelectedStatusArray[l] = this.navigationData[i].products[j].productSelectedStatus;
          l++;
        }
      }
    }
    localStorage.setItem("localStorageEngagementDashboardHeadingStatus", JSON.stringify(engagementDashboardHeadingStatusArray));
    localStorage.setItem("localStorageTeamSelectedStatus", JSON.stringify(teamSelectedStatusArray));
    localStorage.setItem("localStorageProductSelectedStatus", JSON.stringify(productSelectedStatusArray));
    localStorage.setItem("localStorageEngagementProductHeadingStatus", JSON.stringify(engagementProductHeadingStatusArray));
    document.getElementById("sidenav").style.display = "none";
    document.getElementById("sidenav").style.width = "0px";
    document.getElementById("home-icon-panel").style.width = "0px";
    document.getElementById("home-icon-panel").style.display = "none";
    
    this.sideNavStatus = "collapsed";
    document.getElementById('wrapper').style.marginLeft = "0px";
    let breadcrumbElement = document.getElementById("breadcrumb-container");
    let mainContainerElement = document.getElementById("main-container");
    breadcrumbElement.className = breadcrumbElement.className.replace("container-fluid", "container");
    mainContainerElement.className = mainContainerElement.className.replace("container-fluid", "container");

    this.productDetailsSubArea.emit();
  }

  userHomeNavDefault() {
    localStorage.setItem("localStorageEngagementMenuToggleStatus", null);
    localStorage.setItem("localStorageEngagementActiveStatus", null);
    localStorage.setItem("localStorageEngagementDashboardHeadingStatus", null);
    localStorage.setItem("localStorageEngagementTeamHeadingStatus", null);
    localStorage.setItem("localStorageEngagementProductHeadingStatus", null);
    localStorage.setItem("localStorageEngagementTeamDivStatus", null);
    localStorage.setItem("localStorageEngagementProductDivStatus", null);
    localStorage.setItem("localStorageTeamSelectedStatus", null);
    localStorage.setItem("localStorageProductSelectedStatus", null);
  }

  dashboardNavDefault() {
    let currentEngIndex;
    let tempEngagementList; 
    this._leftNavigation.getAllEngagementsWithTeamAndProducts().subscribe((data) => {
      tempEngagementList = data;  
      this.navigationData = data;
      for(let i=0; i<tempEngagementList.length; i++) {
        if(this.engagementId == tempEngagementList[i].engagementId) {
          currentEngIndex = i;  
          break;
        }   
      }
      for(let i=0; i<this.navigationData.length; i++) {
        
          this.navigationData[i].engagementMenuToggleStatus = "collapse";
          this.navigationData[i].engagementActiveStatus = "eng-inactive";
          this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
          this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
          this.navigationData[i].engagementTeamDivStatus = "collapse";
          this.navigationData[i].engagementProductDivStatus = "collapse";
          this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
        
        if(this.navigationData[currentEngIndex].engagementId == this.navigationData[i].engagementId) {
          setTimeout(() => {
            this.navigationData[currentEngIndex].engagementActiveStatus = "eng-active";
            this.navigationData[currentEngIndex].engagementMenuToggleStatus = "collapse in";
            this.navigationData[currentEngIndex].engagementDashboardHeadingStatus = "dash-active";
            this.navigationData[currentEngIndex].engagementTeamDivStatus = "collapse";
            this.navigationData[currentEngIndex].engagementProductDivStatus = "collapse";
            this.navigationData[currentEngIndex].engagementTeamHeadingStatus = "team-inactive";
            this.navigationData[currentEngIndex].engagementProductHeadingStatus = "product-inactive";
          }, 1000);
        }
      }
    }, (error) => {

    });
  }

  teamPageNavDefault() {
    let currentEngIndex;
    let currentTeamIndex;
    this._leftNavigation.getAllEngagementsWithTeamAndProducts().subscribe((data)=>{ 
      this.navigationData = data;
      for(let i=0; i<this.navigationData.length; i++) {
        if(this.engagementId == this.navigationData[i].engagementId) {
          currentEngIndex = i;  
          break;
        }
      }
      for(let i=0; i<this.navigationData.length; i++) {
        if(this.navigationData[i].teams != null) {
          for(let j=0; j<this.navigationData[i].teams.length; j++) {
            if(this.teamId == this.navigationData[i].teams[j].id) {
              currentTeamIndex = j;
              break;
            }
          }
        }
      }
      for(let i=0; i<this.navigationData.length; i++) {
        this.navigationData[i].engagementMenuToggleStatus = "collapse";
        this.navigationData[i].engagementActiveStatus = "eng-inactive";
        this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
        this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
        this.navigationData[i].engagementTeamDivStatus = "collapse";
        this.navigationData[i].engagementProductDivStatus = "collapse";
        this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
        if(this.navigationData[i].teams != null) {
          for(let j=0; j<this.navigationData[i].teams.length; j++) {
            this.navigationData[i].teams[j].teamSelectedStatus = "team-not-selected";
          }
        }
        if(this.navigationData[i].products != null) {
          for(let j=0; j<this.navigationData[i].products.length; j++) {
            this.navigationData[i].products[j].productSelectedStatus = "team-not-selected";
          }
        }
      }

      setTimeout(() => {
        this.navigationData[currentEngIndex].engagementActiveStatus = "eng-active";
        this.navigationData[currentEngIndex].engagementMenuToggleStatus = "collapse in";
        this.navigationData[currentEngIndex].engagementTeamHeadingStatus = "team-active";
        this.navigationData[currentEngIndex].engagementTeamDivStatus = "collapse in";
        this.navigationData[currentEngIndex].teams[currentTeamIndex].teamSelectedStatus = "team-selected";
        this.navigationData[currentEngIndex].engagementDashboardHeadingStatus = "dash-inactive";
      }, 1000);

      
    }, (error) => {
    });
  }

  productPageNavDefault() {
    let currentEngIndex;
    let currentProductIndex;
    this._leftNavigation.getAllEngagementsWithTeamAndProducts().subscribe((data)=>{ 
      this.navigationData = data;
      for(let i=0; i<this.navigationData.length; i++) {
        if(this.engagementId == this.navigationData[i].engagementId) {
          currentEngIndex = i;  
          break;
        }
      }
      for(let i=0; i<this.navigationData.length; i++) {
        if(this.navigationData[i].products != null) {    
          for(let j=0; j<this.navigationData[i].products.length; j++) {
            if(this.productId == this.navigationData[i].products[j].id) {
              currentProductIndex = j;
              break;
            }
          }
        }
      }
      for(let i=0; i<this.navigationData.length; i++) {
        this.navigationData[i].engagementMenuToggleStatus = "collapse";
        this.navigationData[i].engagementActiveStatus = "eng-inactive";
        this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
        this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
        this.navigationData[i].engagementTeamDivStatus = "collapse";
        this.navigationData[i].engagementProductDivStatus = "collapse";
        this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";  
        if(this.navigationData[i].teams != null) {
          for(let j=0; j<this.navigationData[i].teams.length; j++) {
            this.navigationData[i].teams[j].teamSelectedStatus = "team-not-selected";
          }
        }
        if(this.navigationData[i].products != null) {
          for(let j=0; j<this.navigationData[i].products.length; j++) {
            this.navigationData[i].products[j].productSelectedStatus = "product-not-selected";
          }
        }
      }

      setTimeout(() => {
        this.navigationData[currentEngIndex].engagementActiveStatus = "eng-active";
        this.navigationData[currentEngIndex].engagementMenuToggleStatus = "collapse in";
        this.navigationData[currentEngIndex].engagementProductHeadingStatus = "product-active";
        this.navigationData[currentEngIndex].engagementProductDivStatus = "collapse in";
        this.navigationData[currentEngIndex].products[currentProductIndex].productSelectedStatus = "product-selected";
        this.navigationData[currentEngIndex].engagementDashboardHeadingStatus = "dash-inactive";
      }, 1000);
      }, (error) => {
      });    
  }

  clickViewAll(index: number) {
    for(let i=0; i<this.navigationData.length; i++) {
      this.navigationData[i].engagementDashboardHeadingStatus = "dash-inactive";
      this.navigationData[i].engagementTeamHeadingStatus = "team-inactive";
      this.navigationData[i].engagementProductHeadingStatus = "product-inactive";
      this.navigationData[i].engagementTeamDivStatus = "collapse";
      this.navigationData[i].engagementProductDivStatus = "collapse";
    }
    this.navigationData[index].engagementDashboardHeadingStatus = "dash-active";
    window.scrollTo(0, 0);
  }

  sideNavShowHide() {
    if(
      this.pageUrl === '/administrator' || 
      this.pageUrl === '/profile' || 
      this.pageUrl === '/unauthorizedAccess' ||
      this.pageUrl === '/changePassword'
    )
      return false;
    else  
      return true;
  }

  home() {
    window.scroll(0,0);
  }

  logout() {
    this.autoLogoutService.logout('false');
  }

}
