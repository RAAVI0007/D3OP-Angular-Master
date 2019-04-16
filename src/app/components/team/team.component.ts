import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../models/assessment.model';
import { Team } from '../../models/team.model';
import { PersonService } from '../../services/person.service';
import { TeamReportsService } from '../../services/team-reports.service';
import { ExcelService } from '../../services/excel.service';
import { ReportsService } from '../../services/reports-service';
import { PracticeService } from '../../services/practice.service';
import { PracticeScoreService } from '../../services/practice-score.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MaturityConversionService } from '../../services/maturity-conversion.service';
import { EngagementService } from '../../services/engagement.service';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  encapsulation : ViewEncapsulation.None
})


export class TeamComponent implements OnInit {

  dataItems = [];
  prItems = [];
  public cmVsDm = [];
  expanded:any;
  public teamDomains = [];
  public teamSubjects = [];
  public domainNames = [];
  public achievements = [];
  selectedAssessment;
  teamId:string;
  showSideNav:boolean = true;
  engagementId:string;
  engagementNameTitle:string;
  teamNameTitle:string;
  competencies;
  sortFilterCompetencies;
  sortFilterDomains;
  tempSortCompetency = [];
  tempSortDomain = [];
  tempCompetencySort;
  tempDomainSort;
  domainCompetencies;
  team;
  assessments; 
  strategists;
  updateTeamMessage: string = "none";
  createAssessmentMessage: string = "none";
  updatePracticeScoreMessage: string = "none";
  assessmentErrors:Assessment;
  assessmentName:string = '';
  errorMessage: string = "none";
  isAssessmentError:boolean = false;
  linkedProductsIconTable: string = 'fa fa-caret-up';
  linkedProductsIconDualList: string = 'fa fa-caret-down';
  linkedEditIconTeamInfo:string = 'fa fa-caret-up';
  competencyPanelIcon: string = 'fa fa-caret-down';
  competencyChartsIcon: string = 'fa fa-caret-down';
  domainPanelIcon: string = 'fa fa-caret-down';
  domainTableIcon: string = 'fa fa-caret-down';
  allProductsofEngagement;
  linkedProducts;
  linkedProductsNoPagination;
  teamObj;
  sourceProducts;
  targetProducts;
  pages = [];
  pageNumber;
  page:number = 0;
  teamName:string;
  teamDescription:string;
  teamContact:string;
  strategist:string;
  teamErrors:Team;
  isTeamError:boolean = false;
  partitionSymbolEngagement: string;
  partitionSymbolTeamProduct: string;
  userHome: string;
  teamProductSubSecTitle: string;
  partitionSymbolTeamProductSubSec: string;
  userName: string;

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

  practice;
  practiceIdAccordiansHref = [];
  temp;
  practiceScore;
  practiceScoreObject:Object = {};
  
  assessmentId;
  practiceId;
  assessmentDropDown: boolean = true;
  legendsLink: boolean = true;
  element:HTMLElement;
  assessTabActive;
  teamTabActive;
  practiceScoreDisplay;
  currentMaturityVal;
  currMatVal = "1";
  desMatVal = "2";
  valNextMatVal;
  compNextMatVal;
  prioirityOrderVal;
  priorityRationaleVal;
  commentVal;
  currentActiveTab:string = "Team Details";
  practiceScoreError;
  displayPracticeBody: string = "none";  
  selectedAssessmentName;
  strategistNameTitle;
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
  maturityPercentageData:any;  
  maturityPercentageChartData:any; 

  public scrollbarOptions = { 
    axis: 'y', 
    theme: 'dark-3', 
    autoHideScrollbar: 'true'
  };
 
  constructor(
    private teamService:TeamService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private assessmentService:AssessmentService,
    private personService:PersonService,
    private teamReports:TeamReportsService,
    private excelService:ExcelService,
    private reportsService:ReportsService,
    private _practice: PracticeService,
    private eRef: ElementRef,
    private _practiceScoreService: PracticeScoreService, 
    private autoLogoutService:AutoLogoutService,
    private _maturityConversion: MaturityConversionService,
    private _engagementService: EngagementService,
    config: NgbDropdownConfig
  ) { 
    (<any>config).autoClose = 'outside';
  }

  ngOnInit() {
    this.legendsLink = true;
    this.activatedRoute.params.subscribe(params => {
    this.teamId = params.teamId;
    this.engagementId = params.engagementId;
    this.getTeamById(this.engagementId,this.teamId);
    this.getTeamAssessments();
    this.getProductsLinkedToTeam(this.engagementId, this.teamId);
    this.setInitialValuePagination();
    this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
    this.getAllProductsNoPagination(this.engagementId);
    this.userHome = "User Home";
    this.engagementNameTitle = params.engagementName;
    this.teamNameTitle = params.teamName;
    this.partitionSymbolEngagement = ">";
    this.partitionSymbolTeamProduct = ">";
    this.partitionSymbolTeamProductSubSec = ">";
    this.teamProductSubSecTitle = "Team Details";
    this.userName = sessionStorage.getItem("username");
  }); 
}

  setAssessmentTabActive(assessmentId, assessmentName) {
    let eleTeamTab = document.getElementById('team-details-tab');
    eleTeamTab.classList.remove('active');
    let eleAssessTab = document.getElementById('assess-tab');
    eleAssessTab.classList.add('active');
    let eleTeamDet = document.getElementById('teamDetails');
    eleTeamDet.classList.remove('active');
    eleTeamDet.classList.remove('in');
    let eleAssess = document.getElementById('assess');
    eleAssess.classList.add('active');
    eleAssess.classList.add('in');
    this.selectedAssessment = assessmentId;
    this.assessmentId = this.selectedAssessment;
    this.assessmentDropDown = false;
    this.legendsLink = false;
    this.activatedRoute.params.subscribe(params => {
      this.teamId = params.teamId;
      this.engagementId = params.engagementId;
    })
    this.getPracticeScore(this.engagementId, this.assessmentId);
   }

  getTeamById(engagementId:string, teamId:string) {
    this.teamService.getTeamById(this.engagementId, this.teamId).subscribe((data)=>{
      this.team  = data;
    },(error)=>{
    });
  }

  getTeamAssessments() {
    this.assessmentService.getTeamAssessments(this.teamId).subscribe((data)=>{
      this.assessments = data;
      if(this.assessments[0] != undefined) {
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

  reportsTabFunctionality() {
    this.currentActiveTab = "Reports";
    this.assessmentDropDown = false;
    this.legendsLink = false;
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
     this.teamService.createAssessment(this.assessmentObj, this.engagementId, this.teamId).subscribe((data)=>{
      this.assessmentErrors = new Assessment();
      this.closeModel("cancel-btn-create-assessment");
      this.assessmentDropDown = false;
      this.legendsLink = false;
      this.createAssessmentMessage = "block"; 
      if(this.currentActiveTab == "Team Details") {
        let eleTeamTab = document.getElementById('team-details-tab');
        eleTeamTab.classList.remove('active');
        let eleAssessTab = document.getElementById('assess-tab');
        eleAssessTab.classList.add('active');
        let eleTeamDet = document.getElementById('teamDetails');
        eleTeamDet.classList.remove('active');
        eleTeamDet.classList.remove('in');
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

        this.assessmentService.getTeamAssessments(this.teamId).subscribe((data)=>{
          this.assessmentId = data[0].id;
          this.getPracticeScore(this.engagementId, this.assessmentId);
          this.assessments = data;
          this.selectedAssessment = this.assessments[0].id;
          this.selectedAssessmentName = this.assessments[0].name;
        },(error)=>{
        });

       },(error)=>{
          this.errorMessage = "block";
          this.assessmentErrors = error.error;
       });   
  }

  teamDefaults() {
    this.teamErrors = new Team();
    this.teamName = this.team.name;
    this.teamDescription = this.team.description;
    this.teamContact = this.team.contact;
    this.strategist = this.team.strategist.role.name == "ADMIN" ? " " : this.team.strategist.username;
    this.targetProducts = [];
    this.errorMessage = "none";
    this.isTeamError = false;
    this.sourceProducts = this.getAllProductsNoPagination(this.engagementId);
    this.strategists = this.getAllStrategists();
    if(this.team.strategist.role.name == "ADMIN")
      this.strategistNameTitle = "Select Startegist"  
    else 
      this.strategistNameTitle = this.team.strategist.firstName +" "+ this.team.strategist.lastName;
    
  }

  assessmentDefaults() {
    this.assessmentErrors = new Assessment();
    this.assessmentName = '';
    this.errorMessage = "none";
    this.isAssessmentError = false;
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
    if(sectionName === 'linkedProTable') {
      this.linkedProductsIconTable =
      (this.linkedProductsIconTable === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'linkedProDualList') {
      this.linkedProductsIconDualList =
      (this.linkedProductsIconDualList === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
    } else if (sectionName === 'linkedEditTeamInfo') {
      this.linkedEditIconTeamInfo =
      (this.linkedEditIconTeamInfo === 'fa fa-caret-up') ? 'fa fa-caret-down' : 'fa fa-caret-up';
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
    this.teamService.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId).subscribe((data)=>{
      this.totalElements = data['totalElements'];
      this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
    }, (error)=>{
    })
  }


  setPageIndex(i: number) {
    if(this.page != i) {
      this.page = i;
      this.pages = this._engagementService.getPager(this.totalElements, i, this.pageSize).pages;
    if(i == 0)
      this.currentPagePagination = 0;
    else  
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, i, this.pageSize).currentPage;
    this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
    }
  }

  setFirstPageIndex() {
    if(this.page != 0) {
      this.page = 0;
      this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
      this.currentPagePagination = 0;
      this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
    }
  }

  setNextPageIndex() {
    if(this.page < this.pageNumber-1) {
      this.pages = this._engagementService.getPager(this.totalElements, this.currentPagePagination+1, this.pageSize).pages;
      this.page = this.currentPagePagination+1; 
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.currentPagePagination+1, this.pageSize).currentPage;
      this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
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
      this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
    }
  }

  setLastPageIndex() {
    if(this.page != this.pageNumber-1) {
      this.page = this.pageNumber-1;
      this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
      this.pages = this._engagementService.getPager(this.totalElements, this.page, this.pageSize).pages;  
      this.currentPagePagination = this._engagementService.getPager(this.totalElements, this.page, this.pageSize).currentPage;
    }
  }

  getProductsLinkedToTeam(engagementId:string, teamId:string) {
    this.teamService.getProductsLinkedToTeam(this.engagementId, this.teamId).subscribe((data)=>{
      this.linkedProducts = data;
    }, (error)=>{
    })
  }

  getProductsLinkedToTeamNoPagination(page:number, engagementId: string, teamId: string) {
    this.teamService.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId)
      .subscribe((data)=>{
        this.linkedProductsNoPagination = data['content'];
        this.pageNumber = data['totalPages'];
        for(let i=0; i<this.linkedProductsNoPagination.length; i++) {
          this.addKeyValue(this.linkedProductsNoPagination[i], "isTextShorten", true);
        }
      }, (error)=>{
      })
  }

  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  getAllProductsNoPagination(engagementId:string) {
    this.teamService.getAllProductsNoPagination(this.engagementId).subscribe((data)=>{
      this.allProductsofEngagement = data;
      this.getProductsLinkedToTeam(this.engagementId, this.teamId);
      for( let i=this.allProductsofEngagement.length - 1; i>=0; i--){
        if(this.linkedProducts != null) {
          for( let j=0; j<this.linkedProducts.length; j++){
            if(this.allProductsofEngagement[i] && (this.allProductsofEngagement[i].name === this.linkedProducts[j].name)){
                this.allProductsofEngagement.splice(i, 1);
            }
          }
        }
      }
      this.sourceProducts = this.allProductsofEngagement;
      this.targetProducts = this.linkedProducts;
    }, (error)=>{
      
    })
  }

  updateTeam(engagementId:string) {
    this.teamObj = {
      "id": this.teamId,
      "name": this.teamName,
      "description": this.teamDescription,
      "contact": this.teamContact,
      "strategist": {
        "username": this.strategist == " " ? sessionStorage.getItem("username") : this.strategist
      },
      "products":[ 
      ]
    }
    
    for(let i=0; i<this.targetProducts.length;i++) {
       this.teamObj.products.push({
         id: this.targetProducts[i].id
       })
     }
     this.teamService.updateTeam(this.teamObj, this.engagementId).subscribe((data)=>{
        this.teamErrors = new Team();
        this.closeModel("cancel-btn-upd-team");
        this.getTeamById(this.engagementId,this.teamId);
        this.getProductsLinkedToTeam(this.engagementId, this.teamId);
        this.getProductsLinkedToTeamNoPagination(this.page, this.engagementId, this.teamId);
        this.getAllProductsNoPagination(this.engagementId);
        this.currentPagePagination = 0;
        this.setInitialValuePagination();
        this.updateTeamMessage = "block";
        setTimeout(()=>{ 
          this.updateTeamMessage = "none";
        }, 10000);
       },(error)=>{
       this.errorMessage = "block";
       this.teamErrors = error.error;
    });
  }

  savePracticeScore = function(practiceScoreData) {
    this.practiceScoreObject = {
      "id": this.assessmentId,
      "teamId": this.teamId,
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

    this._practiceScoreService.updateTeamPracticeScore(this.engagementId, this.practiceScoreObject).subscribe((data)=>{
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

  getPracticeScore(engagementId:string, assessmentId: string) {
    this._practiceScoreService.getTeamPracticeScore(this.engagementId, assessmentId).subscribe((data)=>{
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

      this.practiceScore = this.reportsService.sortById(this.practiceScore);

    },(error)=>{
    })
  }

  teamDetailsTabFunctionality() {
   this.assessmentService.getTeamAssessments(this.teamId).subscribe((data)=>{
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
    this.currentActiveTab = "Team Details";
  }

  setTeamDetailsAreaActive(event) {
    if(document.getElementById("assess-tab").className === "active") {
      document.getElementById("assess-tab").classList.remove("active");
      document.getElementById("assess").classList.remove("active", "in");
    }
    if(document.getElementById("reports-tab").className === "active") {
      document.getElementById("reports-tab").classList.remove("active");
      document.getElementById("reports").classList.remove("active", "in");
    }    
    document.getElementById("team-details-tab").classList.add("active");
    document.getElementById("teamDetails").classList.add("active", "in");
    this.assessmentDropDown = true;
    this.legendsLink = true;
  }

  assessTabFunctionality() {
    this.assessmentDropDown = false;
    this.activatedRoute.params.subscribe(params => {
      this.teamId = params.teamId;
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

  onStrategistChange(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.strategistNameTitle = selectedOptions[selectedIndex].text;
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

  setAllMaturityTitleEmpty() {
    this.currentMaturityTitle = "";
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

  toggleShortenLinkedProductText(linkedProductId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.linkedProductsNoPagination.length; i++) {
      if (this.linkedProductsNoPagination[i].id === linkedProductId) {
        this.linkedProductsNoPagination[i].isTextShorten = !this.linkedProductsNoPagination[i].isTextShorten;
      }
    }
  }

  logout() {
    this.autoLogoutService.logout('false');
  }

  closeModel(buttonId: string) {
    let element = document.getElementById(buttonId) as any;
    element.click();
  }


  openAssessmentModel() {
    let element = document.getElementById("createAssessmentModal") as any;
    element.click();
  }


  // Reports code started
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
      this.dmVsPmData = this.reportsService.getDmVsPmData();
      this.maturityValues = this.reportsService.getMaturityValues();
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
        this.teamReports.getReportsData(this.assessmentId).subscribe((data)=>{
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
        this.teamErrors = error.error;
     });
    }
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
  
  public competencyFilterText = this.reportsService.getCompetencyFilterText();

  public domainFilterText = this.reportsService.getDomainFilterText();

 
  competencySortBy;
  competencyReverse;
  competencyColumnSort;
  sortCompetencyHeaderClick = function(col){
    this.competencySortBy = col;
    if(this.competencyReverse){
      this.competencyReverse = false;
    } else{
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

   toggleShortenCompetencyText(competencyId: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.sortFilterCompetencies.length; i++) {
      if (this.sortFilterCompetencies[i].id === competencyId) {
        this.sortFilterCompetencies[i].isTextShorten = !this.sortFilterCompetencies[i].isTextShorten;
      }
    }
  }


  domainSortBy;
  domainReverse;
  sortDomainHeaderClick = function(col){
    this.domainSortBy = col;
    if(this.domainReverse){
      this.domainReverse = false;
    } else{
      this.domainReverse = true;
    }
   };
   
   // remove and change class
   sortDomainClass = function(col){
    if(this.domainSortBy == col ){
     if(this.domainReverse){
      return 'sorting_asc'; 
     } else{
      return 'sorting_desc';
     }
    }else{
     return 'sorting';
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

lastVisitedDropDown:string = "";

// toggledropDownDisplay(dropdownType:string) {
//   for(let displayIndex = 0 ; displayIndex < this.expanded.length; displayIndex++)  {
//     let ele = document.getElementById(this.expanded[displayIndex]) as HTMLElement;
//     if(dropdownType === this.expanded[displayIndex]) {
//       this.lastVisitedDropDown = dropdownType;
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

landToTeamDetailsTab() {
  if(this.assessments.length == 0) {
    let eleTeamTab = document.getElementById('team-details-tab');
    eleTeamTab.classList.add('active');
    let eleAssessTab = document.getElementById('assess-tab');
    eleAssessTab.classList.remove('active');
    let eleReportsTab = document.getElementById('reports-tab');
    eleReportsTab.classList.remove('active');
    let eleTeamDet = document.getElementById('teamDetails');
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
    this.currentActiveTab = "Team Details";
    }    
  }

  onClickedOutside(e: Event) {
   for(let displayIndex = 0 ; displayIndex < 10 ; displayIndex++)  { 
      let ele = document.getElementById(this.expanded[displayIndex]) as HTMLElement;
      if(ele.style.display === "") {
        ele.style.display = 'none';
      }else {
        if(ele.style.display === 'block') {
          ele.style.display = 'none';
        }
      }
    }
  }
}