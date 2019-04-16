import { Component, OnInit, Output, EventEmitter, ViewChildren  } from '@angular/core';
import { AssessmentConfigurationService } from '../../services/assessment-configuration.service';
import { AssessmentConfiguration } from '../../models/assessment-configuration';
import { CompetencyDomainPipe } from '../../pipes/competency-domain.pipe';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
 
@Component({
  selector: 'app-assessment-configuration',
  templateUrl: './assessment-configuration.component.html',
  styleUrls: ['./assessment-configuration.component.css']
})
export class AssessmentConfigurationComponent implements OnInit {

  competencies;
  competenciesErrors;
  domains;
  domainsByType;
  domainSortBy: string = "ascending";
  domainSortIcon: string = "fa fa-sort";
  assessmentType: string = "SELECT";
  disableDomainField: boolean = true;
  displayCompetenciesError: string = "none";
  competencyCreatedSuccessMessage: string = "none"
  assessmentConfig: AssessmentConfiguration = new AssessmentConfiguration();
  competencyDomain = [];  
  checkedListDomain = [];
  checkedListTitle = [];
  selectAllDomain: boolean;
  selectAllTitle: boolean;
  expanded: boolean = false;
  titlesByType;
  competencyTitle = [];
  trackIndex;
  competencyDetail;
  competencyUpdatedSuccessMessage;
  selectAssessmentTitle: string;
  assessmentTypeTitle: string;
  selectedDomainTitle: string;

  @Output() messageEvent = new EventEmitter<string>();
  @Output() messageEventUpdatePractice = new EventEmitter<string>();
  @ViewChildren('checkFilterDataLength') filteredItems;
  constructor(
    private _assessmentConfigurationService: AssessmentConfigurationService,
    config: NgbDropdownConfig
  ) {
    (<any>config).autoClose = 'outside';
   }

  ngOnInit() {
    this.getAllAssessments(this.assessmentType);
    this.getDomains();
    this.setModelValuesDefault();
  }

  getAllAssessments(assessmentType: String) {
    if(assessmentType == "SELECT") {
      this.competencies = [];
    } else if(assessmentType == "TEAM" || assessmentType == "PRODUCT") {
      this._assessmentConfigurationService.getPracticeByType(assessmentType).subscribe((data) => {
      this.competencies = data;
      this.competencies.sort( function(id1, id2) {
        if ( id1.id < id2.id ){
          return -1;
        }else if( id1.id > id2.id ){
            return 1;
        }else{
          return 0;	
        }
      });
      for(let i=0; i<this.competencies.length; i++) {
        this.addKeyValue(this.competencies[i], "isTextShorten", true);
      }
    }, (error) => {
    });
    }
  }

  assessmentTypeChanged() {
    this.competencyDomain = [];
    this.competencyTitle = [];
    this.getAllAssessments(this.assessmentType);
    this.domainSortIcon = "fa fa-sort";
    this.getDomainsByType(this.assessmentType);
    this.getTitlesByType(this.assessmentType);
    if(this.assessmentType == "PRODUCT")
      this.selectAssessmentTitle = "Product Assessment";
    else if(this.assessmentType == "TEAM") 
    this.selectAssessmentTitle = "Team Assessment";
  }

  getDomains() {
    this._assessmentConfigurationService.getDomains().subscribe((data)=>{
      this.domains = data;
    }, (error) => {
    });
  }

  getDomainsByType(type: string) {
    this._assessmentConfigurationService.getDomainByType(type).subscribe((data) => {
      this.competencyDomain = [];
      this.domainsByType = data;
      for(let i=0; i<this.domainsByType.length;i++) {
        this.competencyDomain.push({
          name: this.domainsByType[i],
          selected: false
        })
      }
    })
  }

  getTitlesByType(type: string) {
    this._assessmentConfigurationService.getTitleByType(type).subscribe((data) => {
      this.competencyTitle = [];
      this.titlesByType = [];
      this.titlesByType = data;
      for(let i=0; i<this.titlesByType.length; i++) {
        this.competencyTitle.push({
          name: this.titlesByType[i],
          selected: false
        })
      }
    }, (error) => {
    });
  }

  createNewCompetency() {
    this.assessmentConfig.status = "Active";
    this._assessmentConfigurationService.createCompetency(this.assessmentConfig).subscribe((data)=>{
      this.competenciesErrors = "";
      this.domainSortIcon = "fa fa-sort";
      let competencyNewOrUpdate = "New"
      this.messageEvent.emit(competencyNewOrUpdate);
      this.assessmentType = this.assessmentConfig.type;
      this.getAllAssessments(this.assessmentConfig.type);
      this.getDomainsByType(this.assessmentConfig.type);
      this.getTitlesByType(this.assessmentConfig.type);
      this.closeModel("cancel-btn-competency-modal");
    }, (error) => {
      this.competenciesErrors = error.error
      this.displayCompetenciesError = "block";
    });
  }

  editCompetency() {
    this.assessmentConfig.id = this.competencyDetail.id;
    this._assessmentConfigurationService.updatePractice(this.assessmentConfig).subscribe((data)=>{
      this.competenciesErrors = "";
      let competencyNewOrUpdate = "Update"
      this.messageEvent.emit(competencyNewOrUpdate);
      this.assessmentType = this.assessmentConfig.type;
      this.getAllAssessments(this.assessmentConfig.type);
      this.getDomainsByType(this.assessmentConfig.type);
      this.getTitlesByType(this.assessmentConfig.type);
      this.closeModel("cancel-btn-edit-competency-modal");
    }, (error) => {
      this.competenciesErrors = [];
      this.competenciesErrors = error.error
      this.displayCompetenciesError = "block";
    });
  }

  onDomainChange() {
    this.assessmentConfig.domain = this.assessmentConfig.domainSelector;
    this.disableDomainField = true;
    if(this.assessmentConfig.domainSelector == "other") {
      this.assessmentConfig.domain = null;
      this.disableDomainField = false; 
    } else if (this.assessmentConfig.domainSelector == "Select Customer") {
      this.assessmentConfig.domain = null;
    } else {
      this.disableDomainField = true;
    }
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.selectedDomainTitle = selectedOptions[selectedIndex].text;
  }
  
  setModelValuesDefault() {
    this.assessmentConfig.domain = null;
    this.assessmentConfig.domainSelector = null;
    this.assessmentConfig.subject = "";
    this.assessmentConfig.question = "";
    this.assessmentConfig.metric = "";
    this.assessmentConfig.type = null;
    this.assessmentConfig.tin = "";
    this.assessmentConfig.bronze = "";
    this.assessmentConfig.silver = "";
    this.assessmentConfig.gold = "";
    this.assessmentConfig.platinum = "";
    this.assessmentConfig.status = "Active";
    this.competenciesErrors = ""; 
    this.disableDomainField = true;
    this.selectAssessmentTitle = "Select";
    this.assessmentTypeTitle = "Select Assessment";
    this.selectedDomainTitle = "Select Domain";
  }

  sortDomainAsc() {
    this.domainSortIcon = "fa fa-sort-up";
    this.competencies.sort( function(domain1, domain2) {
      if ( domain1.domain.trim().toUpperCase() < domain2.domain.trim().toUpperCase() ){
        return -1;
      }else if( domain1.domain.trim().toUpperCase() > domain2.domain.trim().toUpperCase() ){
        return 1;
      }else{
        return 0;	
      }
    });
    this.domainSortBy = "descending";
  }

  sortDomainDesc() {
    this.domainSortIcon = "fa fa-sort-down";
    this.competencies.sort( function(domain1, domain2) {
      if ( domain1.domain.trim().toUpperCase() > domain2.domain.trim().toUpperCase() ){
        return -1;
      }else if( domain1.domain.trim().toUpperCase() < domain2.domain.trim().toUpperCase() ){
          return 1;
      }else{
        return 0;	
      }
    });
    this.domainSortBy = "ascending";
  }

  sortDomain() {
    if(this.domainSortBy === "ascending") {
      this.sortDomainAsc();
    } else if (this.domainSortBy === "descending") {
      this.sortDomainDesc();
    }
  }

  get selectedCompetencyDomain() {
    return this.competencyDomain.reduce((domains, domain) => {
      if (domain.selected) {
        domains.push(domain.name);
      }
      return domains;
    }, [])
  }

  get selectedCompetencyTitle() {
    return this.competencyTitle.reduce((subjects, subject) => {
      if(subject.selected) {
        subjects.push(subject.name);
      }
      return subjects;
    }, [])
  }

  onSelectAllDomain(event) {
    if(event.target.checked) {
      this.checkedListDomain = [];
      for (var i = 0; i < this.competencyDomain.length; i++) {
        this.competencyDomain[i].selected = true;
        this.checkedListDomain.push(this.competencyDomain[i].name);
      }
    } else {
      for (var i = 0; i < this.competencyDomain.length; i++) {
        this.competencyDomain[i].selected = false;
      }
      this.checkedListDomain = [];
    }
  }

  onCheckboxChangeDomain(option, event) {
    if(event.target.checked) {
      this.checkedListDomain.push(option.name);
      if(this.checkedListDomain.length == this.competencyDomain.length) {
        this.selectAllDomain = true;
      }
    } else {
      for(var i=0 ; i < this.competencyDomain.length; i++) {
        if(this.checkedListDomain[i] == option.name){
          this.checkedListDomain.splice(i,1);
          this.selectAllDomain = false;
        }
      }
      this.selectAllDomain = false;
    }
  }

  onSelectAllTitle(event) {
    if(event.target.checked) {
      this.checkedListTitle = [];
      for (var i = 0; i < this.competencyTitle.length; i++) {
        this.competencyTitle[i].selected = true;
        this.checkedListTitle.push(this.competencyTitle[i].name);
      }
    } else {
      for (var i = 0; i < this.competencyTitle.length; i++) {
        this.competencyTitle[i].selected = false;
      }
      this.checkedListTitle = [];
    }
  }

  onCheckboxChangeTitle(option, event) {
    if(event.target.checked) {
      this.checkedListTitle.push(option.name);
      if(this.checkedListTitle.length == this.competencyTitle.length) {
        this.selectAllTitle = true;
      }
    } else {
      for(var i=0 ; i < this.competencyTitle.length; i++) {
        if(this.checkedListTitle[i] == option.name){
          this.checkedListTitle.splice(i,1);
          this.selectAllTitle = false;
        }
      }
      this.selectAllTitle = false;
    }
  }

  onAssessmentTypeSelection(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.assessmentTypeTitle = selectedOptions[selectedIndex].text;
  }

  getPracticeById(id:number) {
    this.competenciesErrors = "";
    this.getDomains();
    this.disableDomainField = true;
    this._assessmentConfigurationService.getPracticeById(id).subscribe((data) => {
      this.competencyDetail = data;
      this.assessmentConfig.type = this.competencyDetail.type;
      this.assessmentConfig.domain = this.competencyDetail.domain;
      this.assessmentConfig.domainSelector = this.competencyDetail.domain;
      this.assessmentConfig.subject = this.competencyDetail.subject;
      this.assessmentConfig.question = this.competencyDetail.question;
      this.assessmentConfig.metric = this.competencyDetail.metric;
      this.assessmentConfig.tin = this.competencyDetail.tin;
      this.assessmentConfig.silver = this.competencyDetail.silver;
      this.assessmentConfig.bronze = this.competencyDetail.bronze;
      this.assessmentConfig.gold = this.competencyDetail.gold;
      this.assessmentConfig.platinum = this.competencyDetail.platinum;
    }, (error) => {
      
    });
  }

  toggleShortenAssessmentConfiguraionText(id: number) {
    (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    for(let i=0; i<this.competencies.length; i++) {
      if (this.competencies[i].id === id) {
        this.competencies[i].isTextShorten = !this.competencies[i].isTextShorten;
      }
    }
  }

  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  closeModel(buttonId: string) {
    let element = document.getElementById(buttonId) as any;
    element.click();
  }

  displaycompetenciesErrorToggle() {
    this.displayCompetenciesError = "none";
  }
}
