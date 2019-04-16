import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { EngagementService } from '../../services/engagement.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { Engagement } from '../../models/engagement.model';
import { DOCUMENT } from '@angular/platform-browser';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { features } from '../../utility/features'

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
    @ViewChild(NavBarComponent) childNavbarComponent:NavBarComponent;
    engagement = new Engagement();
    customers;
    name:string = '';
    description:string = '';
    adminFirstName:string = '';
    adminLastName:string = '';
    adminEmail:string = '';
    adminPhone:string = '';
    billingFirstName:string = '';
    billingLastName:string = '';
    billingEmail:string = '';
    billingPhone:string = '';
    engagementErrors:Engagement;
    isCreated:boolean=false;
    engagementExist:boolean=false;
    page:number=0;
    engagements:Array<any>;
    pages:Array<number>;
    pageNumber:number;
    nextPageStatus: boolean;
    prePageStatus: boolean;
    firstPageStatus: boolean;
    lastPageStatus: boolean;
    engagementObj:Object = {};
    disableCustomerField:boolean = true;
    disableCutomerDefaultField:boolean = false;
    public selectionModel;
    showSideNav: boolean = true;
    engId: string;

    features: any;
    oldBmMessageDisplayed : string;

    customerNameOther:string;
    customer:string="";
    message: string = "none";
    errorMessage: string = "none";
    isError:boolean = false;

    userHome: string = "User Home"
    userName: string;
    messageProfileUpdated: string = "none";
    legendsLink: boolean;
    currentPagePagination: number = 0;
    totalElements: number;
    pageSize: number = 10;


    ngOnInit() {
      this.legendsLink = true;
      this.getEngagements();
      this.setInitialValuePagination();
      this.userName = sessionStorage.getItem("username");
      this.oldBmMessageDisplayed = sessionStorage.getItem("oldBmMessageDisplayed");
      if(this._profile.getProfileChangedStatus()) {
        this.messageProfileUpdated = "block";
        setTimeout(()=>{ 
          this.messageProfileUpdated = "none";
          this._profile.setProfileChangedStatus(false);
        }, 10000);
      }
    }

    constructor(
      private _engagementService:EngagementService, 
      private _profile: ProfileService,
      @Inject(DOCUMENT) private document: any, 
      private router: Router,
      private autoLogoutService:AutoLogoutService
    ) { 
      this.features = features;
    }
    
    ngOnDestroy(){
      sessionStorage.setItem("oldBmMessageDisplayed","yes");
    }

    logout() {
      this.autoLogoutService.logout('false');
    }

    defaults() {
      this.engagementErrors = new Engagement();
      this.name = '';
      this.description = '';
      this.adminFirstName = '';
      this.adminLastName = '';
      this.adminEmail = '';
      this.adminPhone = '';
      this.billingFirstName = '';
      this.billingLastName = '';
      this.billingEmail = '';
      this.billingPhone = '';
      this.customer = '';
      this.disableCutomerDefaultField = false;
      this.getCustomers();
      this.customerNameOther = 'Select Customer';
      this.disableCustomerField = true;
      this.errorMessage = "none";
      
      console.log(document.getElementById("name"));
      
      //this._inputElement.nativeElement.focus();
      
     }

  setPageIndex(i) {  
    if(this.page != i) {
      this.page = i;
      this.pages = this._engagementService.getPager(this.totalElements, i, this.pageSize).pages;
      if(i == 0)
        this.currentPagePagination = 0;  
      else 
        this.currentPagePagination = this._engagementService.getPager(this.totalElements, i, this.pageSize).currentPage;
      this.getEngagements();  
    }
  }

  setFirstPageIndex() {  
    if(this.page != 0) {
      this.page = 0;
      this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
      this.currentPagePagination = 0;
      this.getEngagements();
    }
  }

  setNextPageIndex() {
    if(this.page < this.pageNumber-1) {
      this.pages = this._engagementService.getPager(this.totalElements, this.currentPagePagination+1, this.pageSize).pages; 
      this.page = this.currentPagePagination+1; 
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.currentPagePagination+1, this.pageSize).currentPage;
      this.getEngagements();
    }
  }

  setPreviousPageIndex(i: number) {
    if(this.page > 0) {
      this.pages = this._engagementService.getPager(this.totalElements, this.currentPagePagination-1, this.pageSize).pages; 
      this.page = this.currentPagePagination-1; 
      if(i-1 == 0)
        this.currentPagePagination = 0;
      else   
        this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.currentPagePagination-1, this.pageSize).currentPage;
      this.getEngagements();
    }
  }

  setLastPageIndex() {
    if(this.page != this.pageNumber-1) {
      this.page = this.pageNumber-1;
      this.pages = this._engagementService.getPager(this.totalElements, this.page, this.pageSize).pages;  
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.page, this.pageSize).currentPage;
      this.getEngagements();
    }
  }

  setInitialValuePagination() {
    this._engagementService.getEngagements(this.page).subscribe((data)=>{
      this.totalElements = data['totalElements'];
      this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
    },(error)=>{
      
    });
  }

  getEngagements() {
    this._engagementService.getEngagements(this.page).subscribe((data)=>{
      this.engagements = data['content'];
      this.pageNumber = data['totalPages'];
      this.totalElements = data['totalElements'];
      for(let i=0; i<this.engagements.length; i++) {
        this.addKeyValue(this.engagements[i], "isTextShorten", true);
      }
    },(error)=>{
      
    });
  }

 createEngagement = function(engagement) {
   this.engagementObj = {
    "name": engagement.name,
    "customer": {
      "name": engagement.customer,
      "customerNameOther":this.customerNameOther
    },
    "description": engagement.description,
    "adminFirstName": engagement.adminFirstName,
    "adminLastName": engagement.adminLastName,
    "adminEmail": engagement.adminEmail,
    "adminPhone": engagement.adminPhone,
    "billingFirstName": engagement.billingFirstName,
    "billingLastName": engagement.billingLastName,
    "billingEmail": engagement.billingEmail,
    "billingPhone":  engagement.billingPhone,
    "strategist": {
      "username": sessionStorage.getItem("username")
    }
   }
   this._engagementService
   .createEngagement(this.engagementObj).subscribe((data) => {
    this.engagementErrors = new Engagement();
    this.closeEngagementModel();
    this.page = 0;
    this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
    this.currentPagePagination = 0;
    this.getEngagements();
    this.setInitialValuePagination();
    this.router.navigate(['/']);
    this.message = "block";
    this.childNavbarComponent.getAllEngagementsWithTeamAndProducts();
    this.childNavbarComponent.userHomeNavDefault();
    setTimeout(()=>{ 
      this.message = "none";
    }, 10000);
    },(error)=>{
      this.errorMessage = "block";
      this.engagementErrors = error.error;
    });
  }
  getCustomers() {
    this._engagementService.getCustomers().subscribe(data=>{
      this.customers = data;
    },(error)=>{
    });
  }

  onChange() {
    this.customer = this.customerNameOther;
    this.disableCutomerDefaultField = true;
    if(this.customerNameOther == "Other") {
      this.customer = "";
      this.disableCustomerField = false; 
    } else if (this.customerNameOther == "Select Customer") {
      this.customer = "";
    } else {
      this.disableCustomerField = true;
    }
  }

  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  displayToggle() {
    this.errorMessage = "none";
  }

  toggleShortenEngagementText(engagementId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.engagements.length; i++) {
      if (this.engagements[i].id === engagementId) {
        this.engagements[i].isTextShorten = !this.engagements[i].isTextShorten;
      }
    }
  }

  closeEngagementModel() {
    let element = document.getElementById("cancel-btn-engagement") as any;
    element.click();
  }
}
