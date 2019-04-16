import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../models/assessment.model';
import { PersonService } from '../../services/person.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { PracticeScoreService } from '../../services/practice-score.service';
import { ReportsService } from '../../services/reports-service';
import { ProductReportsService } from '../../services/product-reports.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MaturityConversionService } from '../../services/maturity-conversion.service';
import { EngagementService } from '../../services/engagement.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild(NavBarComponent) childNavbarComponent:NavBarComponent;
  productId:string;
  engagementId:string;
  showSideNav: boolean = true;
  product;
  assessments;
  strategists;
  updateProductMessage: string = "none";
  createAssessmentMessage: string = "none";
  assessmentErrors:Assessment;
  assessmentName:string = '';
  errorMessage: string = "none";
  updatePracticeScoreMessage: string = "none";
  isAssessmentError:boolean = false;
  linkedTeamsIconTable: string = 'fa fa-caret-up';
  linkedTeamsIconDualList: string = 'fa fa-caret-down';
  linkedEditIconProductInfo:string = 'fa fa-caret-up';
  competencyPanelIcon: string = 'fa fa-caret-down';
  competencyChartsIcon: string = 'fa fa-caret-down';
  domainPanelIcon: string = 'fa fa-caret-down';
  domainTableIcon: string = 'fa fa-caret-down';
  allTeamsofEngagement;
  linkedTeams;
  linkedTeamsNoPagination;
  productObj;
  sourceTeams;
  targetTeams;
  pages;
  pageNumber;
  page:number = 0;
  productName:string;
  productDescription:string;
  productContact:string;
  strategist:string;
  productErrors:Product;
  isProductError:boolean = false;
  userHome: string;
  engagementNameTitle: string;
  productNameTitle: string;
  partitionSymbolEngagement: string;
  partitionSymbolTeamProduct: string;
  partitionSymbolTeamProductSubSec: string;
  teamProductSubSecTitle: string;
  userName: string;
  assessmentDropDown: boolean = true;
  selectedAssessment: string;
  selectedAssessmentName: string;
  legendsLink: boolean = true;
  practiceScoreDisplay;
  practiceScore;
  assessmentId;
  currentActiveTab: String = "Product Details";
  practiceId;
  practiceScoreError = [];
  strategistNameTitle: string;
  currentMaturityTitle: string;
  desiredMaturityTitle: string;
  valNextMaturityTitle: string;
  complexityNextMaturityTitle: string;
  priorityOrderTitle: string;
  priorityRationaleTitle: string;
  totalElements: number;
  pageSize: number = 5;
  currentPagePagination: number = 0;

  maturityValues = [
    { value: "0", text: " " },
    { value: "1", text: "Tin" },
    { value: "2", text: "Bronze" },
    { value: "3", text: "Silver" },
    { value: "4", text: "Gold" },
    { value: "5", text: "Platinum" },
  ];

  targetMaturityValues = [];

  public scrollbarOptions = { 
    axis: 'y', 
    theme: 'dark-3', 
    autoHideScrollbar: 'true'
  };

  constructor(
    private productService:ProductService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private assessmentService:AssessmentService,
    private personService:PersonService,
    private _practiceScoreService:PracticeScoreService,
    private reportsService:ReportsService,
    private productReports:ProductReportsService,
    private eRef: ElementRef,
    private autoLogoutService:AutoLogoutService,
    private _maturityConversion: MaturityConversionService,
    private _engagementService: EngagementService,
    config: NgbDropdownConfig
    ) { 
      (<any>config).autoClose = 'outside';
    }

  ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
      this.productId = params.productId;
      this.engagementId = params.engagementId;
      this.targetTeams = [];
      this.getProductById(this.engagementId,this.productId);
      this.setInitialValuePagination();
      this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);
      this.sourceTeams = this.getAllTeamsNoPagination(this.productId, this.engagementId);
      this.strategists = this.getAllStrategists();
      this.assessments = this.getProductAssessments();
      this.userHome = "User Home";
      this.engagementNameTitle = params.engagementName;
      this.productNameTitle = params.productName;
      this.partitionSymbolEngagement = ">";
      this.partitionSymbolTeamProduct = ">";
      this.userName = sessionStorage.getItem("username");
      this.getProductAssessments();
    });
  }

  getProductById(engagementId:string, productId:string) {
    this.productService.getProductById(this.engagementId, this.productId).subscribe((data)=>{
      this.product  = data;
    },(error)=>{
     
    });
  }

  getProductAssessments() {
    this.assessmentService.getProductAssessments(this.productId).subscribe((data)=>{
      this.assessments = data;
      if(this.assessments[0] != null) {
        this.selectedAssessment = this.assessments[0].id;
        this.selectedAssessmentName = this.assessments[0].name;
        this.assessmentId = this.assessments[0].id;
      }
    },(error)=>{
     
    });
  }

  getAllStrategists() {
    this.personService.getAllStrategists().subscribe((data)=>{
      this.strategists = data;
    },(error)=>{
     
    });
  }

  createAssessment = function(assessment) {

    if(this.currentActiveTab === "Reports") {
      this.currentActiveTab = "Assess";
      let eleTeamTab = document.getElementById('reports-tab');
       eleTeamTab.classList.remove('active');
       let eleAssessTab = document.getElementById('assess-tab');
       eleAssessTab.classList.add('active');
       let eleReportDet = document.getElementById('reports');
       eleReportDet.classList.remove('active');
       eleReportDet.classList.remove('in');
       let eleAssessDet = document.getElementById('assess');
       eleAssessDet.classList.add('active');
       eleAssessDet.classList.add('in');
    } 

    this.assessmentObj = {
     "assessmentName": assessment.assessmentName
    }
     this.productService.createAssessment(this.assessmentObj, this.engagementId, this.productId).subscribe((data)=>{
      this.assessmentErrors = new Assessment();
      this.closeModel('cancel-btn-create-assessment');
      this.createAssessmentMessage = "block";
      this.assessmentDropDown = false;
      this.legendsLink = false;
      if(this.currentActiveTab == "Product Details") {
        
        let eleProductTab = document.getElementById('product-details-tab');
        eleProductTab.classList.remove('active');
        let eleAssessTab = document.getElementById('assess-tab');
        eleAssessTab.classList.add('active');
        let eleProductDet = document.getElementById('productDetails');
        eleProductDet.classList.remove('active');
        eleProductDet.classList.remove('in');
        let eleAssess = document.getElementById('assess');
        eleAssess.classList.add('active');
        eleAssess.classList.add('in');
      } else if(this.currentActiveTab == "Assess") {
        let eleAssessTab = document.getElementById('assess-tab');
        eleAssessTab.className = eleAssessTab.className.replace('active', 'active');
      } else if(this.currentActiveTab == "Reports") {
        let eleTeamTab = document.getElementById('reports-tab');
        eleTeamTab.classList.remove('active');
        let eleAssessTab = document.getElementById('assess-tab');
        eleAssessTab.classList.add('active');
        let eleReportDet = document.getElementById('reports');
        eleReportDet.classList.remove('active');
        eleReportDet.classList.remove('in');
      }

      setTimeout(()=>{ 
          this.createAssessmentMessage = "none";
        }, 10000);

        this.activatedRoute.params.subscribe(params => {
          this.engagementId = params.engagementId;
        });

        this.assessmentService.getProductAssessments(this.productId).subscribe((data)=>{
        this.assessmentId = data[0].id;
        this.getPracticeScore(this.engagementId, this.assessmentId);
        this.assessments = data;
        this.selectedAssessment = this.assessments[0].id;
        this.selectedAssessmentName = this.assessments[0].name;
      });
      },(error)=>{
          this.errorMessage = "block";
          this.assessmentErrors = error.error;
       });
  }

  productDefaults() {
    this.productErrors = new Product();
    this.productName = this.product.name;
    this.productDescription = this.product.description;
    this.strategist = this.product.strategist.role.name == "ADMIN" ? " " : this.product.strategist.username;
    this.targetTeams = [];
    this.errorMessage = "none";
    this.isProductError = false;
    this.sourceTeams = this.getAllTeamsNoPagination(this.productId, this.engagementId);
    this.strategists = this.getAllStrategists();
    if(this.product.strategist.role.name == "ADMIN")
      this.strategistNameTitle = "Select Startegist"  
    else 
      this.strategistNameTitle = this.product.strategist.firstName +" "+ this.product.strategist.lastName;
  }

  assessmentDefaults() {
    this.assessmentErrors = new Assessment();
    this.assessmentName = '';
    this.errorMessage = "none";
    this.isAssessmentError = false;
  }

  onStrategistChange(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.strategistNameTitle = selectedOptions[selectedIndex].text;
  }

  closeAssessmentModel() {
    let eleEngModel = document.getElementById('createAssessment');
    eleEngModel.style.display = "none";
    document.body.className = document.body.className.replace('modal-open','');
    let eleBackDrop = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>;
      if (eleBackDrop.length != 0) {
        for(let k=0; k<eleBackDrop.length;k++) {
          eleBackDrop[k].style.display = "none";
        }
      }
  }

  displayToggle() {
    this.errorMessage = "none";
  }

  changeIcon(sectionName: string) {
    if(sectionName === 'linkedTeaTable') {
      this.linkedTeamsIconTable =
      (this.linkedTeamsIconTable === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'linkedTeaDualList') {
      this.linkedTeamsIconDualList =
      (this.linkedTeamsIconDualList === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'linkedEditProductInfo') {
      this.linkedEditIconProductInfo =
      (this.linkedEditIconProductInfo === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'competencyPanelIcon') {
      this.competencyPanelIcon =
      (this.competencyPanelIcon === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'competencyChartsIcon') {
      this.competencyChartsIcon =
      (this.competencyChartsIcon === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'domainPanelIcon') {
      this.domainPanelIcon =
      (this.domainPanelIcon === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'domainTableIcon') {
      this.domainTableIcon =
      (this.domainTableIcon === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    }
  }

  setInitialValuePagination() {
    this.productService.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId).subscribe((data)=>{
      this.totalElements = data['totalElements'];
      this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
    }, (error)=>{
    })
  }

  setPageIndex(i) {
    if(this.page != i) {
      this.page = i;
      this.pages = this._engagementService.getPager(this.totalElements, i, this.pageSize).pages;
      if(i == 0)
        this.currentPagePagination = 0;
      else
        this.currentPagePagination = this._engagementService.getPager(this.totalElements, i, this.pageSize).currentPage;
      this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);  
    }
  }

  setFirstPageIndex() {
    if(this.page != 0) {
      this.page = 0;
      this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);
      this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
      this.currentPagePagination = 0;
    }
  }

  setNextPageIndex() {
    if(this.page < this.pageNumber-1) {
      this.pages = this._engagementService.getPager(this.totalElements, this.currentPagePagination+1, this.pageSize).pages;
      this.page = this.currentPagePagination+1;
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.currentPagePagination+1, this.pageSize).currentPage;
      this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);
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
      this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);
    }
  }

  setLastPageIndex() {
    if(this.page != this.pageNumber-1) {
      this.page = this.pageNumber-1;
      this.pages = this._engagementService.getPager(this.totalElements, this.page, this.pageSize).pages;  
      this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.page, this.pageSize).currentPage;
    }
  }

  getTeamsLinkedToProduct(engagementId:string, productId:string) {
    this.productService.getTeamsLinkedToProduct(this.engagementId, this.productId).subscribe((data)=>{
      this.linkedTeams = data;
    }, (error)=>{
    })
  }

  getTeamsLinkedToProductNoPagination(page:number, engagementId: string, productId: string) {
    this.productService.getTeamsLinkedToProductNoPagination(page, engagementId, productId)
      .subscribe((data)=>{
        this.linkedTeamsNoPagination = data['content'];
        this.pageNumber = data['totalPages'];
        for(let i=0; i<this.linkedTeamsNoPagination.length; i++) {
          this.addKeyValue(this.linkedTeamsNoPagination[i], "isTextShorten", true);
        }
      }, (error)=>{
      })
  }

  getAllTeamsNoPagination(productId:string, engagementId:string) {
    this.productService.getAllTeamsNoPagination(productId, engagementId).subscribe((data)=>{
      this.sourceTeams = data['sourceTeams'];
      this.targetTeams = data['targetTeams'];
    }, (error)=>{
    })
  }

  updateProduct = function(product) {
     this.productObj = {
      "id": this.productId,
      "name": product.productName,
      "description": product.productDescription,
      "strategist": {
        "username": this.strategist == " " ? sessionStorage.getItem("username") : this.strategist
      },
      "teams":[ 
      ]
    }
    
    for(let i=0; i<this.targetTeams.length;i++) {
       this.productObj.teams.push({
         id: this.targetTeams[i].id
       })
     }
     
     this.productService.updateProduct(this.productObj, this.engagementId).subscribe((data)=>{
        this.productErrors = new Product();
        this.closeProductModel();
        this.getProductById(this.engagementId,this.productId);
        this.getTeamsLinkedToProduct(this.engagementId, this.productId);
        this.getTeamsLinkedToProductNoPagination(this.page, this.engagementId, this.productId);
        this.getAllTeamsNoPagination(this.productId, this.engagementId);
        this.currentPagePagination = 0;
        this.setInitialValuePagination();
        this.updateProductMessage = "block";
        setTimeout(()=>{ 
          this.updateProductMessage = "none";
        }, 10000);
       },(error)=>{
       this.errorMessage = "block";
       this.productErrors = error.error;
    });

  }

  productDetailsTabFunctionality() {
    this.assessmentService.getProductAssessments(this.productId).subscribe((data)=>{
      this.assessments = data; 
    },(error)=>{
    });

    this.assessmentDropDown = true;
    this.legendsLink = true;
    let element1 = document.getElementsByClassName('assess-panel-body') as HTMLCollectionOf<HTMLElement>;
    let element2 = document.getElementsByClassName('panel-caret') as HTMLCollectionOf<HTMLElement>;
    for(let k=0; k<element1.length;k++) {
      element1[k].style.display = "none";
      element2[k].className = element2[k].className.replace('fa-caret-down','fa fa-caret-right');
    } 
    this.currentActiveTab = "Product Details";
  }

  setProductDetailsAreaActive(event) {
    if(document.getElementById("assess-tab").className === "active") {
      document.getElementById("assess-tab").classList.remove("active");
      document.getElementById("assess").classList.remove("active", "in");
    }
    if(document.getElementById("reports-tab").className === "active") {
      document.getElementById("reports-tab").classList.remove("active");
      document.getElementById("reports").classList.remove("active", "in");
    }    
    document.getElementById("product-details-tab").classList.add("active");
    document.getElementById("productDetails").classList.add("active", "in");
    this.assessmentDropDown = true;
    this.legendsLink = true;
  }
  

  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  getPracticeScore(engagementId:string, assessmentId: string) {
    this._practiceScoreService.getProductPracticeScore(this.engagementId, assessmentId).subscribe((data)=>{
      this.practiceScore = data;
      this.practiceScoreDisplay = data;
      for(let i=0; i<this.practiceScore.length; i++) {

        this.addKeyValue(this.practiceScore[i], 'accordianHref', "#"+this.practiceScore[i].id);
        this.addKeyValue(this.practiceScore[i], 'currentMatDis', this.practiceScore[i].currentMaturity);
        this.addKeyValue(this.practiceScore[i], 'desiredMatDis', this.practiceScore[i].desiredMaturity);
        this.addKeyValue(this.practiceScore[i], 'valueNextDis', this.practiceScore[i].valueNext);
        this.addKeyValue(this.practiceScore[i], 'complexityNextDis', this.practiceScore[i].complexityNext);
        this.addKeyValue(this.practiceScore[i], 'priorityOrderDis', this.practiceScore[i].priorityOrder);
        this.addKeyValue(this.practiceScore[i], 'priorityRationaleDis', this.practiceScore[i].priorityRationale);
        this.addKeyValue(this.practiceScore[i], 'commentsDis', this.practiceScore[i].comments);
        this.targetMaturityValues = [];
        if (this.practiceScore[i].currentMaturity == 0) {
          this.targetMaturityValues.push({
            value: "5",
            text: "Platinum"
          })
          this.practiceScore[i].desiredMaturity = this.targetMaturityValues[0].value;
        }

        if(this.practiceScore[i].priorityRationale === "TIN")
          this.practiceScore[i].priorityRationaleDis = "T";
        else if(this.practiceScore[i].priorityRationale === "INTERNAL_INITIATIVE")
          this.practiceScore[i].priorityRationaleDis = "II";
        else if(this.practiceScore[i].priorityRationale === "VALUE_COMPLEXITY")
          this.practiceScore[i].priorityRationaleDis = "VC";
        else if(this.practiceScore[i].priorityRationale === "HIGHEST_VALUE")
          this.practiceScore[i].priorityRationaleDis = "HV";
        else if(this.practiceScore[i].priorityRationale === "LOWEST_COMPLEXITY")
          this.practiceScore[i].priorityRationaleDis = "LC";
        else if(this.practiceScore[i].priorityRationale === "LEVELSET_TEAM_ORG")
          this.practiceScore[i].priorityRationaleDis = "LT";
        else if(this.practiceScore[i].priorityRationale === "DISTANCE_TO_DESIRED_MATURITY")
          this.practiceScore[i].priorityRationaleDis = "DTM";
        else if(this.practiceScore[i].priorityRationale === "NO_ACTION_TARGET_MATURITY_REACHED")
          this.practiceScore[i].priorityRationaleDis = "NAT";
        else if(this.practiceScore[i].priorityRationale === "NO_ACTION_OTHER")
          this.practiceScore[i].priorityRationaleDis = "NAO";
        else if(this.practiceScore[i].priorityRationale === "0")
          this.practiceScore[i].priorityRationaleDis = "";   

      }

      this.practiceScore.sort( function(id1, id2) {
        if ( id1.id < id2.id ){
          return -1;
        }else if( id1.id > id2.id ){
            return 1;
        }else{
          return 0;	
        }
      });

    },(error)=>{
    })
  }

  assessTabFunctionality() {
    this.assessmentDropDown = false;
    this.activatedRoute.params.subscribe(params => {
      this.productId = params.productId;
      this.engagementId = params.engagementId;
    })
    this.assessmentId = this.selectedAssessment;
    this.getPracticeScore(this.engagementId, this.assessmentId);
    this.legendsLink = false;
    this.currentActiveTab = "Assess";
    if(this.assessments.length === 0) {
      let element = document.getElementById("create-assessment-assess-tab") as any;
      element.click();
    }
  }

  onAssessmentChange(assessmentValue) {
    this.selectedAssessment = assessmentValue;
    this.assessmentId = this.selectedAssessment;
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.selectedAssessmentName = selectedOptions[selectedIndex].text;
    if(this.currentActiveTab === 'Assess') {
      this.getPracticeScore(this.engagementId, this.assessmentId);
    } else {
      this.loadReports();
    }
  }

  getCurrentPracticeId(practiceId, id) {
    this.practiceId = practiceId;
    this.practiceScoreError = [];
    let element1 = document.getElementsByClassName('assess-panel-body') as HTMLCollectionOf<HTMLElement>;
    let element2 = document.getElementsByClassName('panel-caret') as HTMLCollectionOf<HTMLElement>;
    for(let k=0; k<element1.length;k++) {
      if((element1[k].id) != id) {
        element1[k].style.display = "none"
      } else {
        if(element1[k].style.display == "block")
          element1[k].style.display = "none";
        else {
          element1[k].style.display = "block";  
        } 
      }
      if(element1[k].style.display == "block") {

        /* Setting default title of dropdown */
        
        this.currentMaturityTitle = this._maturityConversion.mappingCurrentTargetMaturityValues(this.practiceScore[k].currentMaturity);
        this.desiredMaturityTitle = this._maturityConversion.mappingCurrentTargetMaturityValues(this.practiceScore[k].desiredMaturity);
        this.valNextMaturityTitle = this._maturityConversion.mappingNextAndComplexityMaturityValues(this.practiceScore[k].valueNext);
        this.complexityNextMaturityTitle = this._maturityConversion.mappingNextAndComplexityMaturityValues(this.practiceScore[k].complexityNext);
        this.priorityOrderTitle = this._maturityConversion.mappingNextAndComplexityMaturityValues(this.practiceScore[k].priorityOrder);
        this.priorityRationaleTitle = this._maturityConversion.mappingPriorityRationaleValues(this.practiceScore[k].priorityRationale);

        element2[k].className = element2[k].className.replace('fa-caret-right','fa fa-caret-down');
        this.targetMaturityValues = [];
        for(let i = this.practiceScore[k].currentMaturity; i<6; i++) {
          this.targetMaturityValues.push({
            value: this.maturityValues[i].value,
            text: this.maturityValues[i].text
          })
        }

        if (this.practiceScore[k].currentMaturity == 0) {
          this.targetMaturityValues = [];
          this.targetMaturityValues.push({
            value: "5",
            text: "Platinum"
          })
          this.practiceScore[k].desiredMaturity = this.targetMaturityValues[0].value;
        }

      } else if(element1[k].style.display == "none")
        element2[k].className = element2[k].className.replace('fa-caret-down','fa fa-caret-right');
    }
  }

  onCurrentMaturityChange(currentMaturityValue, index) {
    this.targetMaturityValues = [];
    for(let i = currentMaturityValue; i<6; i++) {
      this.targetMaturityValues.push({
        value: this.maturityValues[i].value,
        text: this.maturityValues[i].text
      })
    }
    if(this.practiceScore[index].desiredMaturity < currentMaturityValue) {
      this.practiceScore[index].desiredMaturity = this.targetMaturityValues[0].value;
    }  
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.currentMaturityTitle = selectedOptions[selectedIndex].text;
  }

  changeTitle(event, type) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    if(type == "desiredMaturityTitle")
      this.desiredMaturityTitle = selectedOptions[selectedIndex].text;
    else if(type == "valNextMaturityTitle")  
      this.valNextMaturityTitle = selectedOptions[selectedIndex].text;
    else if(type == "complexityNextMaturityTitle")  
      this.complexityNextMaturityTitle = selectedOptions[selectedIndex].text;
    else if(type == "priorityOrderTitle")  
      this.priorityOrderTitle = selectedOptions[selectedIndex].text;
    else if(type == "priorityRationaleTitle")  
      this.priorityRationaleTitle = selectedOptions[selectedIndex].text;
  }

  toggleShortenLinkedTeamText(linkedTeamId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.linkedTeamsNoPagination.length; i++) {
      if (this.linkedTeamsNoPagination[i].id === linkedTeamId) {
        this.linkedTeamsNoPagination[i].isTextShorten = !this.linkedTeamsNoPagination[i].isTextShorten;
      }
    }
  }

  savePracticeScore = function(practiceScoreData) {
    this.practiceScoreObject = {
      "id": this.assessmentId,
      "productId": this.productId,
      "practiceScoreVO": {
        "practiceId": this.practiceId,
        "currentMaturity": practiceScoreData.currentMaturity,
        "desiredMaturity": practiceScoreData.desiredMaturity,
        "valueNext": practiceScoreData.valueNext,
        "complexityNext": practiceScoreData.complexityNext,
        "priorityOrder": practiceScoreData.priorityOrder,
        "priorityRationale": practiceScoreData.priorityRationale,
        "comments": practiceScoreData.comment,
      } 
    }
    this._practiceScoreService.updateProductPracticeScore(this.engagementId, this.practiceScoreObject).subscribe((data)=>{
      let element1 = document.getElementsByClassName('assess-panel-body') as HTMLCollectionOf<HTMLElement>;
      let element2 = document.getElementsByClassName('panel-caret') as HTMLCollectionOf<HTMLElement>;
      for(let k=0; k<element1.length;k++) {
        if(element1[k].style.display == "block") {
          this.practiceScore[k].currentMatDis = this.practiceScore[k].currentMaturity;
          this.practiceScore[k].desiredMatDis = this.practiceScore[k].desiredMaturity;
          this.practiceScore[k].valueNextDis = this.practiceScore[k].valueNext;
          this.practiceScore[k].complexityNextDis = this.practiceScore[k].complexityNext;
          this.practiceScore[k].priorityOrderDis = this.practiceScore[k].priorityOrder;
  
          if(this.practiceScore[k].priorityRationale === "TIN")
            this.practiceScore[k].priorityRationaleDis = "T";
          else if(this.practiceScore[k].priorityRationale === "INTERNAL_INITIATIVE")
            this.practiceScore[k].priorityRationaleDis = "II";
          else if(this.practiceScore[k].priorityRationale === "VALUE_COMPLEXITY")
            this.practiceScore[k].priorityRationaleDis = "VC";
          else if(this.practiceScore[k].priorityRationale === "HIGHEST_VALUE")
            this.practiceScore[k].priorityRationaleDis = "HV";
          else if(this.practiceScore[k].priorityRationale === "LOWEST_COMPLEXITY")
            this.practiceScore[k].priorityRationaleDis = "LC";
          else if(this.practiceScore[k].priorityRationale === "LEVELSET_TEAM_ORG")
            this.practiceScore[k].priorityRationaleDis = "LT";
          else if(this.practiceScore[k].priorityRationale === "DISTANCE_TO_DESIRED_MATURITY")
            this.practiceScore[k].priorityRationaleDis = "DTM";
          else if(this.practiceScore[k].priorityRationale === "NO_ACTION_TARGET_MATURITY_REACHED")
            this.practiceScore[k].priorityRationaleDis = "NAT";
          else if(this.practiceScore[k].priorityRationale === "NO_ACTION_OTHER")
            this.practiceScore[k].priorityRationaleDis = "NAO";
          else if(this.practiceScore[k].priorityRationale === "0")
            this.practiceScore[k].priorityRationaleDis = "";  
          this.practiceScore[k].commentsDis = this.practiceScore[k].comments;
          element1[k].style.display = "none";
          element2[k].className = element2[k].className.replace('fa-caret-down','fa fa-caret-right');
        }
      }   
      this.updatePracticeScoreMessage = "block";
      setTimeout(()=>{
        this.updatePracticeScoreMessage = "none";
      }, 10000);  
    },(error)=>{
      this.practiceScoreError = error.error;
    })
  }

  landToProductDetailsTab() {
    if(this.assessments.length == 0) {
      let eleTeamTab = document.getElementById('product-details-tab');
      eleTeamTab.classList.add('active');
      let eleAssessTab = document.getElementById('assess-tab');
      eleAssessTab.classList.remove('active');
      let eleReportsTab = document.getElementById('reports-tab');
      eleReportsTab.classList.remove('active');
      let eleTeamDet = document.getElementById('productDetails');
      eleTeamDet.classList.add('active');
      eleTeamDet.classList.add('in');
      let eleAssess = document.getElementById('assess');
      eleAssess.classList.remove('active');
      eleAssess.classList.remove('in');
      let eleReports = document.getElementById('reports');
      eleReports.classList.remove('active');
      eleReports.classList.remove('in');
      this.legendsLink = true;
      this.assessmentDropDown = true;
      this.currentActiveTab = "Product Details";
    }    
  }
 
  setAssessmentTabActive(assessmentId, assessmentName) {
    let eleProductTab = document.getElementById('product-details-tab');
    eleProductTab.classList.remove('active');
    let eleAssessTab = document.getElementById('assess-tab');
    eleAssessTab.classList.add('active');
    let eleProductDet = document.getElementById('productDetails');
    eleProductDet.classList.remove('active');
    eleProductDet.classList.remove('in');
    let eleAssess = document.getElementById('assess');
    eleAssess.classList.add('active');
    eleAssess.classList.add('in');
    this.selectedAssessment = assessmentId;
    this.assessmentId = this.selectedAssessment;
    this.assessmentDropDown = false;
    this.legendsLink = false;
    this.activatedRoute.params.subscribe(params => {
      this.productId = params.productId;
      this.engagementId = params.engagementId;
    })
    this.getPracticeScore(this.engagementId, this.assessmentId);
  }

  logout() {
    this.autoLogoutService.logout('false');
  }

  closeModel(buttonId: string) {
    let element = document.getElementById(buttonId) as any;
    element.click();
  }

  closeProductModel() {
    let element = document.getElementById("cancel-btn-upd-product") as any;
    element.click();
  }

  radarChartLabels = [];
  mpChartLabels = [];
  cm =[];
  dm =[];
  legends = [];
  cm2 = [];
  pm2 = [];
  da2 = [];
  cptd = [];
  filterArr = [];
  layout:any;
  config:any;
  cmVsTmRadarOptions:any; 
  dmVsPmOptions:any;
  maturityPercentageDomainOptions;
  maturityPercentageOptions:any;  
  scatterPlotData = [];
  cmVsTMRadarData:any; 
  dmVsPmData:any;
  maturityPercentageData:any;  
  maturityPercentageChartData:any; 
  expanded:any;
  domainSortBy;
  domainReverse;
  competencySortBy;
  competencyReverse;
  subjectSelectedAll: boolean = false;
  domainSelectedAll: boolean = false;
  cmSelectedAll: boolean = false;
  tmSelectedAll: boolean = false;
  cmVsDmSelectedAll: boolean = false;
  poSelectedAll: boolean = false;
  prSelectedAll: boolean = false;
  vnSelectedAll: boolean = false;
  cnSelectedAll: boolean = false;
  domainNameSelectedAll:boolean = false;
  achievementsSelectedAll:boolean = false;
  public cmVsDm = [];
  public teamDomains = [];
  public teamSubjects = [];
  public domainNames = [];
  public achievements = [];
  competencies;
  sortFilterCompetencies;
  sortFilterDomains;
  tempSortCompetency = [];
  tempSortDomain = [];
  tempCompetencySort;
  tempDomainSort;
  domainCompetencies;
  dataItems = [];
  prItems = [];

  competencyFilterText = this.reportsService.getCompetencyFilterText();
  domainFilterText = this.reportsService.getDomainFilterText();

  loadReports() {
    this.reportsTabFunctionality();
   if(this.assessments.length === 0) {
     let element = document.getElementById("create-assessment-assess-tab") as any;
     element.click();
   } else {
     this.prItems = this.reportsService.getPrItems();
     this.layout = this.reportsService.getScatterplotLayout();
     this.config = this.reportsService.getScatterplotConf();
     this.cmVsTmRadarOptions = this.reportsService.getCMvsTMRadarOptions();
     this.cmVsTMRadarData = this.reportsService.getCMVsTMRadarData();
     this.maturityPercentageChartData = this.reportsService.getMaturityPercentageChartData();
     this.maturityPercentageOptions = this.reportsService.getMaturityPercentageOptions();
     this.dmVsPmOptions = this.reportsService.getDmVsPmOptions();
     this.maturityPercentageDomainOptions = this.reportsService.getMaturityPercentageDomainOptions();
     this.dmVsPmData = [];
     this.dmVsPmData = this.reportsService.getDmVsPmData();
     this.maturityValues = this.reportsService.getMaturityValues();
     this.maturityPercentageData = [];
     this.maturityPercentageData = this.reportsService.getMaturityPercentageData();
     this.expanded = this.reportsService.getDropdownList();
     this.domainSortBy = "";
     this.domainReverse = "";
     this.competencySortBy = "";
     this.competencyReverse = ""; 
     this.subjectSelectedAll= false;
     this.domainSelectedAll= false;
     this.cmSelectedAll= false;
     this.tmSelectedAll= false;
     this.cmVsDmSelectedAll= false;
     this.poSelectedAll= false;
     this.prSelectedAll= false;
     this.vnSelectedAll= false;
     this.cnSelectedAll= false;
     this.competencyFilterText = this.reportsService.getCompetencyFilterText();
     
       this.cmVsDm = [];
       this.teamDomains = [];
       this.teamSubjects = [];
       this.domainNames = [];
       this.achievements = [];
       this.scatterPlotData = [];
       this.competencies = "";
       this.sortFilterCompetencies = "";
       this.domainCompetencies = "";
       this.productReports.getReportsData(this.assessmentId).subscribe((data)=>{
       this.competencies = data['reportsCompetency'];
       this.competencies = this.reportsService.sortById(this.competencies);
       this.sortFilterCompetencies = this.competencies;
      for(let i=0; i<this.sortFilterCompetencies.length; i++) {
        this.addKeyValue(this.sortFilterCompetencies[i], "isTextShorten", true);
      }
       this.dataItems = data['dataItems'];
       this.domainCompetencies = data['domainCompetencies'];
       this.domainCompetencies = this.reportsService.sortById(this.domainCompetencies);
       this.sortFilterDomains = this.domainCompetencies;
       this.radarChartLabels = [];
       this.teamDomains = data['domains'];
       this.teamDomains = this.reportsService.sortData(this.teamDomains);
       this.teamSubjects = data['subjects'];
       this.teamSubjects = this.reportsService.sortData(this.teamSubjects);
       this.domainNames = data['domainNames'];
       this.domainNames = this.reportsService.sortData(this.domainNames);
       this.achievements = data['achievements'];
       this.cmVsDm = data['cmVsDm'];
       this.cm = [];
       this.dm = [];
       this.cptd = [];
       for(let i = 0 ; i < this.competencies.length ; i++) {
         this.radarChartLabels.push(this.competencies[i].subject);
         this.dm.push(this.competencies[i].desiredMaturity);
         this.cm.push(this.competencies[i].currentMaturity);
         this.cptd.push(this.competencies[i].cmVsDm);
         this.scatterPlotData.push(this.reportsService.pushDataToScatterPlot(this.competencies[i]));
       }
       
       this.cmVsTMRadarData[1].data = this.cm;
       this.cmVsTMRadarData[0].data = this.dm;
       this.maturityPercentageChartData[0].data = this.cptd;  
       this.legends = [];
       this.cm2 = [];
       this.pm2 = [];
       this.da2 = [];
       for(let i = 0 ; i < this.domainCompetencies.length; i++) {
         this.cm2.push(this.domainCompetencies[i].sumOfCurrentMaturity);
         this.pm2.push(this.domainCompetencies[i].noOfCompetency*5);
         this.da2.push(this.domainCompetencies[i].domainAchievement);
         this.legends.push(this.domainCompetencies[i].domain);
       }  
       this.dmVsPmData[1].data = this.cm2;
       this.dmVsPmData[0].data = this.pm2;
       this.maturityPercentageData[0].data = this.da2;
     },(error)=>{
       this.errorMessage = "block";
       this.productErrors = error.error;
    });
   }
 }

 reportsTabFunctionality() {
  this.currentActiveTab = "Reports";
  this.assessmentDropDown = false;
}

  public downloadCanvas(event, canvasId) {
    this.reportsService.downloadCanvas(event, canvasId);
  }

  exportFile(table, fileName, downloadAnchor) {
    let ele = document.getElementById(downloadAnchor) as HTMLElement;
    var blobURL = this.reportsService.exportToExcel(table);
    ele.setAttribute('download',fileName+'.xls')
    ele.setAttribute('href',blobURL);
  }

  convertStringToNum(val) {
    return parseInt(val);
  }

  showFormattedValue(val) {
    return this.reportsService.showFormattedValue(val);
  }

  dropdownHeaders = this.reportsService.getCompetencyHeaders();
  competencyColumnSort;
  sortCompetencyHeaderClick = function(col){
    this.competencySortBy = col;
    if(this.competencyReverse){
      this.competencyReverse = false;
      
    }else{
      this.competencyReverse = true;
    }
   };
   
   // remove and change class
   sortCompetencyClass = function(col){
    if(this.competencySortBy == col ){
     if(this.competencyReverse){
       this.competencyColumnSort = 'sorting_asc'; 
      return this.competencyColumnSort; 
     } else{
      this.competencyColumnSort = 'sorting_desc'; 
      return this.competencyColumnSort;
     }
    }else{
     return 'sorting';
    }
   } 

  sortDomainHeaderClick = function(col){
    this.domainSortBy = col;
    if(this.domainReverse){
      this.domainReverse = false;
      
    }else{
      this.domainReverse = true;
    }
   };
   
   // remove and change class
   sortDomainClass = function(col){
    if(this.domainSortBy == col ){
     if(this.domainReverse){
      return 'sorting_asc'; 
     }else{
      return 'sorting_desc';
     }
    }else{
     return 'sorting';
    }
   } 

   toggleShortenCompetencyText(competencyId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.sortFilterCompetencies.length; i++) {
      if (this.sortFilterCompetencies[i].id === competencyId) {
        this.sortFilterCompetencies[i].isTextShorten = !this.sortFilterCompetencies[i].isTextShorten;
      }
    }
  }

   updateCompetencyFilter() {
    this.tempCompetencySort = [];
    this.tempSortCompetency = [];
    this.sortFilterCompetencies = [];
    this.sortFilterCompetencies = this.competencies;
    
    for(let row = 0; row < this.sortFilterCompetencies.length; row++) {
      if(this.competencyFilterText.subject.indexOf(this.sortFilterCompetencies[row].subject.trim()) > -1) {
        this.tempSortCompetency.push(this.sortFilterCompetencies[row]);
      }
    } 
    this.tempSortCompetency = this.tempSortCompetency.length > 0 ? this.tempSortCompetency : this.competencies; 
    
    if(this.competencyFilterText.domain.length > 0) {
       let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.domain.indexOf(this.tempSortCompetency[row].domain) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found) {
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     } 

    if(this.competencyFilterText.currentMaturity.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.currentMaturity.indexOf(this.tempSortCompetency[row].currentMaturity) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found) {
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     } 

     if(this.competencyFilterText.desiredMaturity.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.desiredMaturity.indexOf(this.tempSortCompetency[row].desiredMaturity) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found){
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     } 

     if(this.competencyFilterText.cmVsDm.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.cmVsDm.indexOf(this.convertStringToNum(this.tempSortCompetency[row].cmVsDm)) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found){
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     } 
    
     if(this.competencyFilterText.priorityOrder.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.priorityOrder.indexOf(this.tempSortCompetency[row].priorityOrder) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found){
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     }
     
     if(this.competencyFilterText.priorityRationale.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.priorityRationale.indexOf(this.tempSortCompetency[row].priorityRationale) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found){
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     } 

     if(this.competencyFilterText.valueNext.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.valueNext.indexOf(this.tempSortCompetency[row].valueNext) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found){
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     }

     if(this.competencyFilterText.complexityNext.length > 0) {
      this.tempCompetencySort = [];
      let found:boolean = false;
      for(let row = 0; row < this.tempSortCompetency.length; row++) {
        if(this.competencyFilterText.complexityNext.indexOf(this.tempSortCompetency[row].complexityNext) > -1) {
          found = true;
          this.tempCompetencySort.push(this.tempSortCompetency[row]);
        }
      }
      if(!found){
        this.tempSortCompetency = [];
        this.tempCompetencySort =[];
      }
      else
        this.tempSortCompetency = this.tempCompetencySort.length > 0 ? this.tempCompetencySort : this.tempSortCompetency;
     }
    
    this.sortFilterCompetencies = this.tempSortCompetency;
    if(this.competencySortBy.length > 0 && this.competencyColumnSort != 'undefined') {
      this.sortFilterCompetencies = this.reportsService.sortFilterItems(this.sortFilterCompetencies, this.competencySortBy, this.competencyColumnSort);
    }
    return this.sortFilterCompetencies;   
  }

  onDomainCheckboxChange(option, event, dropdownType:string, deafult:number) {
    if(dropdownType === 'domainName') {
     if(event.target.checked) {
       this.domainFilterText.domainNames.push(option.itemName);
       if(this.domainFilterText.domainNames.length == this.domainNames.length) {
         this.domainNameSelectedAll = true;
       }
     } else {
       this.domainFilterText.domainNames.splice(this.domainFilterText.domainNames.indexOf(option.itemName), 1);
       this.domainNameSelectedAll = false;
     }
    } else if(dropdownType === 'achievement') {
     if(event.target.checked) {
       this.domainFilterText.achievements.push(option.itemName.toString());
       if(this.domainFilterText.achievements.length == this.achievements.length) {
         this.achievementsSelectedAll = true;
       }
     } else {
       this.domainFilterText.achievements.splice(this.domainFilterText.achievements.indexOf(option.itemName.toString()), 1);
       this.achievementsSelectedAll = false;
     }
    }
    this.updateDomainFilter();
  }

onCompetencyCheckboxChange(option, event, dropdownType:string, deafult:number) {
  if(dropdownType === 'subject') {
  if(event.target.checked) {
    this.competencyFilterText.subject.push(option.itemName);
    if(this.competencyFilterText.subject.length == this.teamSubjects.length) {
      this.subjectSelectedAll = true;
    }
  } else {
    this.competencyFilterText.subject.splice(this.competencyFilterText.subject.indexOf(option.itemName), 1);
    this.subjectSelectedAll = false;
  }
  } else if(dropdownType === 'domain') {
  if(event.target.checked) {
    this.competencyFilterText.domain.push(option.itemName);
    if(this.competencyFilterText.domain.length == this.teamDomains.length) {
      this.domainSelectedAll = true;
    }
  } else {
    this.competencyFilterText.domain.splice(this.competencyFilterText.domain.indexOf(option.itemName), 1);
    this.domainSelectedAll = false;
  }
  } else if(dropdownType === 'cm') {
  if(event.target.checked) {
    this.competencyFilterText.currentMaturity.push(option.id.toString());
    if(this.competencyFilterText.currentMaturity.length == this.dataItems[0].length) {
      this.cmSelectedAll = true;
    }
  } else {
    this.competencyFilterText.currentMaturity.splice(this.competencyFilterText.currentMaturity.indexOf(option.id.toString()), 1);
    this.cmSelectedAll = false;
  }
  } else if(dropdownType === 'tm') {
  if(event.target.checked) {
    this.competencyFilterText.desiredMaturity.push(option.id.toString());
    if(this.competencyFilterText.desiredMaturity.length == this.dataItems[1].length) {
      this.tmSelectedAll = true;
    }
  } else {
    this.competencyFilterText.desiredMaturity.splice(this.competencyFilterText.desiredMaturity.indexOf(option.id.toString()), 1);
    this.tmSelectedAll = false;
  } 
  } else if(dropdownType === 'cmVsDm') {
  if(event.target.checked) {
    this.competencyFilterText.cmVsDm.push(this.convertStringToNum(option.itemName));
    if(this.competencyFilterText.cmVsDm.length == this.cmVsDm.length) {
      this.cmVsDmSelectedAll = true;
    }
  } else {
    this.competencyFilterText.cmVsDm.splice(this.competencyFilterText.cmVsDm.indexOf(option.itemName), 1);
    this.cmVsDmSelectedAll = false;
  }
  } else if(dropdownType === 'po') {
  if(event.target.checked) {
    this.competencyFilterText.priorityOrder.push(option.id.toString());
    if(this.competencyFilterText.priorityOrder.length == this.dataItems[2].length) {
      this.poSelectedAll = true;
    }
  } else {
    this.competencyFilterText.priorityOrder.splice(this.competencyFilterText.priorityOrder.indexOf(option.id.toString()), 1);
    this.poSelectedAll = false;
  }
  } else if(dropdownType === 'pr') {
  if(event.target.checked) {
    this.competencyFilterText.priorityRationale.push(option.itemName.toString());
    if(this.competencyFilterText.priorityRationale.length == this.prItems.length) {
      this.prSelectedAll = true;
    }
  } else {
    this.competencyFilterText.priorityRationale.splice(this.competencyFilterText.priorityRationale.indexOf(option.id.toString()), 1);
    this.prSelectedAll = false;
  }
  } else if(dropdownType === 'vn') {
  if(event.target.checked) {
    this.competencyFilterText.valueNext.push(option.id.toString());
    if(this.competencyFilterText.valueNext.length == this.dataItems[3].length) {
      this.vnSelectedAll = true;
    }
  } else {
    this.competencyFilterText.valueNext.splice(this.competencyFilterText.valueNext.indexOf(option.id.toString()), 1);
    this.vnSelectedAll = false;
  }
  } else if(dropdownType === 'cn') {
  if(event.target.checked) {
    this.competencyFilterText.complexityNext.push(option.id.toString());
    if(this.competencyFilterText.complexityNext.length == this.dataItems[4].length) {
      this.cnSelectedAll = true;
    }
  } else {
    this.competencyFilterText.complexityNext.splice(this.competencyFilterText.complexityNext.indexOf(option.id.toString()), 1);
    this.cnSelectedAll = false;
  }
  }
  this.updateCompetencyFilter();
}

onDomainCheckAll(event, dropdownType:string, deafult:number) {
  if(dropdownType === 'domainName') {
    if(event.target.checked) {
      this.domainFilterText.domainNames = [];
      for (var i = 0; i < this.domainNames.length; i++) {
        this.domainNames[i].selected = true;
        this.domainFilterText.domainNames.push(this.domainNames[i].itemName);
      }
    } else {
      for (var i = 0; i < this.domainNames.length; i++) {
        this.domainNames[i].selected = false;
      }
      this.domainFilterText.domainNames = [];
    }
  } if(dropdownType === 'achievement') {
    if(event.target.checked) {
      this.domainFilterText.achievements = [];
      for (var i = 0; i < this.achievements.length; i++) {
        this.achievements[i].selected = true;
        this.domainFilterText.achievements.push(this.achievements[i].itemName.toString());
      }
    } else {
      for (var i = 0; i < this.achievements.length; i++) {
        this.achievements[i].selected = false;
      }
      this.domainFilterText.achievements = [];
    }
  }
   this.updateDomainFilter();
}

  
onCompetencyCheckAll(event, dropdownType:string, deafult:number) {
  if(dropdownType === 'subject') {
    if(event.target.checked) {
      this.competencyFilterText.subject = [];
      for (var i = 0; i < this.teamSubjects.length; i++) {
        this.teamSubjects[i].selected = true;
        this.competencyFilterText.subject.push(this.teamSubjects[i].itemName);
      }
    } else {
      for (var i = 0; i < this.teamSubjects.length; i++) {
        this.teamSubjects[i].selected = false;
      }
      this.competencyFilterText.subject = [];
    }
  } else if(dropdownType === 'domain') {
    if(event.target.checked) {
      this.competencyFilterText.domain = [];
      for (var i = 0; i < this.teamDomains.length; i++) {
        this.teamDomains[i].selected = true;
        this.competencyFilterText.domain.push(this.teamDomains[i].itemName);
      }
    } else {
      for (var i = 0; i < this.teamDomains.length; i++) {
        this.teamDomains[i].selected = false;
      }
      this.competencyFilterText.domain = [];
    }
  } else if(dropdownType === 'cm') {
    if(event.target.checked) {
      this.competencyFilterText.currentMaturity = [];
      for (var i = 0; i < this.dataItems[0].length; i++) {
        this.dataItems[0][i].selected = true;
        this.competencyFilterText.currentMaturity.push(this.dataItems[0][i].id.toString());
      }
    } else {
      for (var i = 0; i < this.dataItems[0].length; i++) {
        this.dataItems[0][i].selected = false;
      }
      this.competencyFilterText.currentMaturity = [];
    }
  } else if(dropdownType === 'tm') {
    if(event.target.checked) {
      this.competencyFilterText.desiredMaturity = [];
      for (var i = 0; i < this.dataItems[1].length; i++) {
        this.dataItems[1][i].selected = true;
        this.competencyFilterText.desiredMaturity.push(this.dataItems[1][i].id.toString());
      }
    } else {
      for (var i = 0; i < this.dataItems[1].length; i++) {
        this.dataItems[1][i].selected = false;
      }
      this.competencyFilterText.desiredMaturity = [];
    }
  } else if(dropdownType === 'cmVsDm') {
    if(event.target.checked) {
      this.competencyFilterText.cmVsDm = [];
      for (var i = 0; i < this.cmVsDm.length; i++) {
        this.cmVsDm[i].selected = true;
        this.competencyFilterText.cmVsDm.push(this.convertStringToNum(this.cmVsDm[i].itemName));
      }
    } else {
      for (var i = 0; i < this.cmVsDm.length; i++) {
        this.cmVsDm[i].selected = false;
      }
      this.competencyFilterText.cmVsDm = [];
    }
  } else if(dropdownType === 'po') {
    if(event.target.checked) {
      this.competencyFilterText.priorityOrder = [];
      for (var i = 0; i < this.dataItems[2].length; i++) {
        this.dataItems[2][i].selected = true;
        this.competencyFilterText.priorityOrder.push(this.dataItems[2][i].id.toString());
      }
    } else {
      for (var i = 0; i < this.dataItems[2].length; i++) {
        this.dataItems[2][i].selected = false;
      }
      this.competencyFilterText.priorityOrder = [];
    }
  } else if(dropdownType === 'pr') {
    if(event.target.checked) {
      this.competencyFilterText.priorityRationale = [];
      for (var i = 0; i < this.prItems.length; i++) {
        this.prItems[i].selected = true;
        this.competencyFilterText.priorityRationale.push(this.prItems[i].itemName.toString());
      }
    } else {
      for (var i = 0; i < this.prItems.length; i++) {
        this.prItems[i].selected = false;
      }
      this.competencyFilterText.priorityRationale = [];
    }
  } else if(dropdownType === 'vn') {
    if(event.target.checked) {
      this.competencyFilterText.valueNext = [];
      for (var i = 0; i < this.dataItems[3].length; i++) {
        this.dataItems[3][i].selected = true;
        this.competencyFilterText.valueNext.push(this.dataItems[3][i].id.toString());
      }
    } else {
      for (var i = 0; i < this.dataItems[3].length; i++) {
        this.dataItems[3][i].selected = false;
      }
      this.competencyFilterText.valueNext = [];
    }
  } else if(dropdownType === 'cn') {
    if(event.target.checked) {
      this.competencyFilterText.complexityNext = [];
      for (var i = 0; i < this.dataItems[4].length; i++) {
        this.dataItems[4][i].selected = true;
        this.competencyFilterText.complexityNext.push(this.dataItems[4][i].id.toString());
      }
    } else {
      for (var i = 0; i < this.dataItems[4].length; i++) {
        this.dataItems[4][i].selected = false;
      }
      this.competencyFilterText.complexityNext = [];
    }
  } 
  this.updateCompetencyFilter();
}

// toggledropDownDisplay(dropdownType:string) {
//   for(let displayIndex = 0 ; displayIndex < this.expanded.length; displayIndex++)  {
//     let ele = document.getElementById(this.expanded[displayIndex]) as HTMLElement;
//     if(dropdownType === this.expanded[displayIndex]) {
//       if(ele.style.display === 'block') {
//         ele.style.display = 'none';  
//       } else {
//         ele.style.display = 'block';
//       }  
//     } else {
//       ele.style.display = 'none';
//     }
//   }

// }

updateDomainFilter() {
  this.tempDomainSort = [];
  this.tempSortDomain = [];
  this.sortFilterDomains = [];
  this.sortFilterDomains = this.domainCompetencies;
  
  for(let row = 0; row < this.sortFilterDomains.length; row++) {
    if(this.domainFilterText.domainNames.indexOf(this.sortFilterDomains[row].domain.trim()) > -1) {
      this.tempSortDomain.push(this.sortFilterDomains[row]);
    }
  } 
  this.tempSortDomain = this.tempSortDomain.length > 0 ? this.tempSortDomain : this.domainCompetencies;
  
  if(this.domainFilterText.achievements.length > 0) {
    this.tempDomainSort = [];
    let found:boolean = false;
    for(let row = 0; row < this.tempSortDomain.length; row++) {
      if(this.domainFilterText.achievements.indexOf(this.tempSortDomain[row].domainAchievement.toString()) > -1) {
        found = true;
        this.tempDomainSort.push(this.tempSortDomain[row]);
      }
    }
    if(!found) {
      this.tempSortDomain = [];
      this.tempDomainSort =[];
    }
    else
      this.tempSortDomain = this.tempDomainSort.length > 0 ? this.tempDomainSort : this.tempSortDomain;
   } 
  
  this.sortFilterDomains = this.tempSortDomain;
  return this.sortFilterDomains; 
}

  downloadPlotGraph(event) {
    this.reportsService.downloadPlotGraph(event);
  }

  close(event) {
    if (!this.eRef.nativeElement.contains(event.target)) // or some similar check
      console.log("<<<<<<<<<<<<<<<<<<<<<");
   }

   closeDomain(event, name:string) {
    console.log("<<<<<<<<<<<<<<<<<<<<<"+ name);
    if (!this.eRef.nativeElement.contains(event.target)) // or some similar check
      console.log("<<<<<<<<<<<<<<<<<<<<<");
   }

}