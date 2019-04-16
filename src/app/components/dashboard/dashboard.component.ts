import { Component, OnInit, ViewChild } from '@angular/core';
import { EngagementService } from '../../services/engagement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '../../models/team.model';
import { Product } from '../../models/product.model';
import { Engagement } from '../../models/engagement.model';
import { PersonService } from '../../services/person.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(NavBarComponent) childNavbarComponent:NavBarComponent;
  team = new Team();
  engagementId:string;
  currentEngagement = new Engagement();
  engagementErrors:Engagement;
  engagementObj:Object = {};
  customerNameOther;
  teams;
  pageTeam:number=0;
  pagesTeam:Array<number>;
  pageNumberTeam:number;
  teamErrors:Team;
  products;
  pageProduct:number=0;
  pagesProduct:Array<number>;
  pageNumberProduct:number;
  availableProducts;
  sourceProducts;
  targetProducts;
  strategist:string;
  selectedStrategist:string;
  strategistList;
  teamName:string;
  teamDescription:string;
  teamContact:string;

  isTeamError:boolean = false;
  errorMessage: string = "none";
  message: string = "none";
  engagementUpdated: string = "none";
  productAddedMessage: string = "none";

  productName:string;
  productDescription:string;
  sourceTeams;
  targetTeams;
  productErrors:Product;
  isProductError:boolean = false;
  productErrorMessage: string = "none";
  userHome:string;
  engagementName: string;
  partitionSymbolEngagement:string;
  engagementNameTitle:string;
  userName: string;
  legendsLink: boolean;
  showSideNav: boolean = true;
  strategistNameTitle;
  currentPagePaginationTeam: number = 0;
  teamPages = [];
  pageSize: number = 5;
  totalElementsTeam: number;
  totalElementsProduct: number;
  productPages = [];
  currentPagePaginationProduct: number = 0;
  strategistRole: String;

  constructor(
    private _engagementService:EngagementService, 
    private personService:PersonService,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private autoLogoutService:AutoLogoutService
    ) {}
                  
  ngOnInit() {
    this.legendsLink = true;
    this.activatedRoute.params.subscribe(params => {
      this.engagementId = params.engagementId;
      this.engagementName = params.engagementName;
      this.setInitialValuePaginationTeamProduct();
      this.getTeams();
      this.getProducts();
      this.getEngagementById(this.engagementId);
      this.getAllProductsNoPagination(this.engagementId);
      this.targetTeams = [];
      this.targetProducts = [];
      this.getAvailableTeams(this.engagementId);
      this.userHome = "User Home";
      this.engagementErrors = new Engagement();
      this.engagementNameTitle = params.engagementName;
      this.partitionSymbolEngagement = ">";
      this.userName = sessionStorage.getItem("username");
      this.getAllStrategists();
    });
  }

  getAllStrategists() {
    this.personService.getAllStrategists().subscribe((data)=>{
      this.strategistList = data;
    },(error)=>{
    });
  }

  onStrategistChange(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.strategistNameTitle = selectedOptions[selectedIndex].text;
  }

  getEngagementById(engagementId)
  {
    this._engagementService.getEngagementByID(engagementId).subscribe((data)=>{
      this.currentEngagement = data ;
      this.customerNameOther = this.currentEngagement.customer.name;
      this.strategist = this.currentEngagement.strategist.username;
      this.selectedStrategist = this.strategist;
      
    }, (error)=>{
    });
  }

  updateEngagement = function(engagement) {
    this.engagementObj = {
      "id":this.engagementId,
     "name": engagement.name,
     "customer": {
       "name": this.customerNameOther,
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
       "username": this.strategist
     }
    }
    this._engagementService
    .saveEngagement(this.engagementObj).subscribe((data) => {
     this.engagementErrors = new Engagement();
     this.closeEngagementModel();
     this.getEngagementById(this.engagementId);
     this.engagementUpdated = "block";
     setTimeout(()=>{ 
       this.engagementUpdated = "none";
     }, 10000);
     },(error)=>{
       this.errorMessage = "block";
       this.engagementErrors = error.error;
     });
   }

   defaults() {
    this.getEngagementById(this.engagementId); 
    this.engagementErrors = new Engagement();
    this.engagementUpdated = "none";
    this.errorMessage = "none";

    /* For fetching selected strategist name from dropdown as soon as modal pop up*/ 
    let selectedOptions = (document.getElementById("strategist")) as HTMLSelectElement;
    let selectedIndex = selectedOptions.selectedIndex;
    if(this.strategistNameTitle != undefined) 
      this.strategistNameTitle = (selectedOptions[selectedIndex] as HTMLOptionElement).text;
    if(this.currentEngagement.strategist.role.name == 'ADMIN') {
      selectedOptions.selectedIndex = 0;
      this.strategistNameTitle = "Select Strategist"
    }
   }

   setDataToDefault() {
     this.getEngagementById(this.engagementId); 
   }

  createTeam = function(team) {
    this.teamObj = {
     "name": team.teamName,
     "description": team.teamDescription,
     "contact": team.teamContact,
     "strategist":{
      "username": sessionStorage.getItem("username")
    },
      "products": [
       
      ]
    }
    
    for(let i=0; i<this.targetProducts.length;i++) {
      this.teamObj.products.push({
        id: this.targetProducts[i].id
      })
    }

     this._engagementService.createTeam(this.teamObj, this.engagementId).subscribe((data)=>{
       this.teamErrors = new Team();
       this.closeTeamModel();
       this.pageTeam = 0;
       this.getTeams();
        //this.teamPages = this._engagementService.getPager(this.totalElementsTeam, 0, this.pageSize).pages;
        this.currentPagePaginationTeam = 0;
        this._engagementService.getTeams(this.engagementId, this.pageTeam).subscribe((data)=>{
          this.totalElementsTeam = data['totalElements'];
          this.teamPages = this._engagementService.getPager(this.totalElementsTeam, 0, this.pageSize).pages;
        },(error)=>{
        });
        this.message = "block";
        this.childNavbarComponent.getAllEngagementsWithTeamAndProducts();
        this.childNavbarComponent.dashboardNavDefault();
        setTimeout(()=>{ 
          this.message = "none";
        }, 10000);
       },(error)=>{
       this.errorMessage = "block";
       this.teamErrors = error.error;
    });
  }
    
  createProduct = function(product) {
    this.productObj = {
     "name": product.productName,
     "description": product.productDescription,
     "strategist":{
        "username": sessionStorage.getItem("username")
      },
      "teams": [
        
      ]
    }
    
    for(let productIndex = 0; productIndex < this.targetTeams.length; productIndex++) {
      this.productObj.teams.push({
        id: this.targetTeams[productIndex].id
      })
    }

    this._engagementService.createProduct(this.productObj, this.engagementId).subscribe((data)=>{
      this.productErrors = new Product();
      this.closeProductModel();
      this.pageProduct = 0;
      //this.productPages = this._engagementService.getPager(this.totalElementsProduct, 0, this.pageSize).pages;
      this.currentPagePaginationProduct = 0;
      this.getProducts();
      this._engagementService.getProducts(this.engagementId, this.pageProduct).subscribe((data)=>{
        this.totalElementsProduct = data['totalElements'];
        this.productPages = this._engagementService.getPager(this.totalElementsProduct, 0, this.pageSize).pages;
      });
      this.productAddedMessage = "block";
      this.childNavbarComponent.getAllEngagementsWithTeamAndProducts();
      this.childNavbarComponent.dashboardNavDefault();
        setTimeout(()=>{ 
          this.productAddedMessage = "none";
        }, 10000);
    },(error)=>{
      this.productErrorMessage = "block";
      this.productErrors = error.error;
   });

   
  }

  productDefaults() {
    this.productErrors = new Product();
    this.productErrorMessage = "none"
    this.productName = '';
    this.productDescription = '';
    this.targetTeams = [];
    this.sourceTeams = this.getAvailableTeams(this.engagementId);
    this.isProductError = false;
  }

  getAvailableTeams(engagementId) {
    this._engagementService.getAvailableTeams(engagementId).subscribe((data)=>{
      this.sourceTeams = data;
    },(error)=>{
    });
  }

  
  getTeams() {
    this._engagementService.getTeams(this.engagementId, this.pageTeam).subscribe((data)=>{
      this.teams = data['content'];
      this.pagesTeam = new Array(data['totalPages']);
      this.pageNumberTeam = data['totalPages'];
      for(let i=0; i<this.teams.length; i++) {
        this.addKeyValue(this.teams[i], "isTextShorten", true);
      }
    },(error)=>{
    });
  }

  getProducts() {
    this._engagementService.getProducts(this.engagementId, this.pageProduct).subscribe((data)=>{
      this.products = data['content'];
      this.pagesProduct = new Array(data['totalPages']);
      this.pageNumberProduct = data['totalPages'];
      for(let i=0; i<this.products.length; i++) {
        this.addKeyValue(this.products[i], "isTextShorten", true);
      }
    },(error)=>{
    });
  }

  getAllProductsNoPagination(engagementId) {
    this._engagementService.getAllProductsNoPagination(engagementId).subscribe((data)=>{
      this.sourceProducts = data;
    },(error)=>{
    });
  }

  teamDefaults() {
    this.teamErrors = new Team();
    this.teamName = '';
    this.teamDescription = '';
    this.teamContact = '';
    this.targetProducts = [];
    this.errorMessage = "none";
    this.isTeamError = false;
    this.sourceProducts = this.getAllProductsNoPagination(this.engagementId);    
  }

  toggleShortenTeamText(teamId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.teams.length; i++) {
      if (this.teams[i].id === teamId) {
        this.teams[i].isTextShorten = !this.teams[i].isTextShorten;
      }
    }
  }

  toggleShortenProductText(productId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.products.length; i++) {
      if (this.products[i].id === productId) {
        this.products[i].isTextShorten = !this.products[i].isTextShorten;
      }
    }
  }

  displayToggle() {
    this.productErrorMessage = "none";
    this.errorMessage = "none";
  }

  logout() {
    this.autoLogoutService.logout('false');
  }

  setInitialValuePaginationTeamProduct() {
    this._engagementService.getTeams(this.engagementId, this.pageTeam).subscribe((data)=>{
      this.totalElementsTeam = data['totalElements'];
      this.teamPages = this._engagementService.getPager(this.totalElementsTeam, 0, this.pageSize).pages;
    },(error)=>{
    });

    this._engagementService.getProducts(this.engagementId, this.pageProduct).subscribe((data)=>{
      this.totalElementsProduct = data['totalElements'];
      this.productPages = this._engagementService.getPager(this.totalElementsProduct, 0, this.pageSize).pages;
    });
  }
  
  setPageIndex(i) {
    if(this.pageTeam != i) {
      this.pageTeam = i;
      this.getTeams();
      this.teamPages = this._engagementService.getPager(this.totalElementsTeam, i, this.pageSize).pages;
      if(i == 0)
        this.currentPagePaginationTeam = 0;
      else   
        this.currentPagePaginationTeam = this._engagementService.getPager(this.totalElementsTeam, i, this.pageSize).currentPage;
    }
  }
  
  setFirstPageIndex() {
    if(this.pageTeam != 0) {
      this.pageTeam = 0;
      this.teamPages = this._engagementService.getPager(this.totalElementsTeam, 0, this.pageSize).pages;
      this.currentPagePaginationTeam = 0;
      this.getTeams();
    }
  }

  setNextPageIndex() {
    if(this.pageTeam < this.pageNumberTeam-1) {
      this.teamPages = this._engagementService.getPager(this.totalElementsTeam, this.currentPagePaginationTeam+1, this.pageSize).pages; 
      this.pageTeam = this.currentPagePaginationTeam+1; 
      this.currentPagePaginationTeam = this._engagementService.getPager(this.totalElementsTeam, this.currentPagePaginationTeam+1, this.pageSize).currentPage;
      this.getTeams();
    }
  }

  setPreviousPageIndex(i: number) {
    if(this.pageTeam > 0) {
      this.teamPages = this._engagementService.getPager(this.totalElementsTeam, this.currentPagePaginationTeam-1, this.pageSize).pages; 
      this.pageTeam = this.currentPagePaginationTeam-1; 
      if(i-1 == 0)
        this.currentPagePaginationTeam = 0;
      else 
        this.currentPagePaginationTeam = this._engagementService.getPager(this.totalElementsTeam, this.currentPagePaginationTeam-1, this.pageSize).currentPage;  
      this.getTeams();
    }
  }

  setLastPageIndex() {
    if(this.pageTeam != this.pageNumberTeam-1) {
      this.pageTeam = this.pageNumberTeam-1;
      this.teamPages = this._engagementService.getPager(this.totalElementsTeam, this.pageTeam, this.pageSize).pages; 
      this.currentPagePaginationTeam = this._engagementService.getPager(this.totalElementsTeam, this.pageTeam, this.pageSize).currentPage;  
      this.getTeams();
    }
  }

  log($event) {}

  setProductPageIndex(i: number) {
    if(this.pageProduct != i) {
      this.pageProduct = i;
      this.getProducts();
      this.productPages = this._engagementService.getPager(this.totalElementsProduct, i, this.pageSize).pages;
      if(i == 0)
        this.currentPagePaginationProduct = 0;
      else   
        this.currentPagePaginationProduct = this._engagementService.getPager(this.totalElementsProduct, i, this.pageSize).currentPage;
    }
  }
  
  setProductFirstPageIndex() {
    if(this.pageProduct != 0) {
      this.pageProduct = 0;
      this.productPages = this._engagementService.getPager(this.totalElementsProduct, 0, this.pageSize).pages;
      this.currentPagePaginationProduct = 0;
      this.getProducts();
    }
  }

  setProductNextPageIndex() {
    if(this.pageProduct < this.pageNumberProduct - 1) {
      this.productPages = this._engagementService.getPager(this.totalElementsProduct, this.currentPagePaginationProduct+1, this.pageSize).pages; 
      this.pageProduct = this.currentPagePaginationProduct+1; 
      this.currentPagePaginationProduct = this._engagementService.getPager(this.totalElementsProduct, this.currentPagePaginationProduct+1, this.pageSize).currentPage;
      this.getProducts();
    }
  }

  setProductPreviousPageIndex(i: number) {
    if(this.pageProduct > 0) {
      this.productPages = this._engagementService.getPager(this.totalElementsProduct, this.currentPagePaginationProduct-1, this.pageSize).pages; 
      this.pageProduct = this.currentPagePaginationProduct-1; 
      if(i-1 == 0)
        this.currentPagePaginationProduct = 0;
      else  
        this.currentPagePaginationProduct = this._engagementService.getPager(this.totalElementsProduct, this.currentPagePaginationProduct-1, this.pageSize).currentPage;  
      this.getProducts();
    }
  }

  setProductLastPageIndex() {
    if(this.pageProduct != this.pageNumberProduct - 1) {
      this.pageProduct = this.pageNumberProduct-1;
      this.productPages = this._engagementService.getPager(this.totalElementsProduct, this.pageProduct, this.pageSize).pages; 
      this.currentPagePaginationProduct = this._engagementService.getPager(this.totalElementsTeam, this.pageProduct, this.pageSize).currentPage;  
    }
    this.getProducts();
  }

  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  closeProductModel() {
    let element = document.getElementById("cancel-btn-product") as any;
    element.click();
  }

  closeTeamModel() {
    let element = document.getElementById("cancel-btn-team") as any;
    element.click();
  }

  closeEngagementModel() {
    let element = document.getElementById("cancel-btn-engagement") as any;
    element.click();
  }

}
