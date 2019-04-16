import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/picklist';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StorageServiceModule} from 'angular-webstorage-service';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { LoginRedirect } from './services/login-redirect.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { GlobalService } from './global.service';
import { CookieService } from 'ngx-cookie-service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { EngagementService } from './services/engagement.service';
import { ProductComponent } from './components/product/product.component';
import { TeamComponent } from './components/team/team.component';
import { TeamService } from './services/team.service';
import { AssessmentService } from './services/assessment.service';
import { ProductService } from './services/product.service';
import { PersonService } from './services/person.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserService } from './services/user.service';
import { HttpRequestInterceptors } from './interceptors/http.request.interceptors';
import { SecurityQuestionComponent } from './components/security-question/security-question.component';
import { ProfileService } from './services/profile.service';
import { TeamReportsService } from './services/team-reports.service';
import { ProductReportsService } from './services/product-reports.service';
import { PlotlyModule } from 'angular-plotly.js';
import { ExcelService } from './services/excel.service';
import { ReportsService } from './services/reports-service';
import { FilterComponent } from './components/filter/filter.component';
import { CompetencySortDirective } from './directives/competency-sort.directive';
import { SortableColumnComponent } from './components/sortable-column/sortable-column.component';
import { DomainSortDirective } from './directives/domain-sort.directive';
import { PracticeService } from './services/practice.service';
import { PracticeScoreService } from './services/practice-score.service';
import { ClickOutsideModule } from 'ng4-click-outside';
import { SessionTimeoutComponent } from './components/session-timeout/session-timeout.component'; 
import { AutoLogoutService } from './services/auto-logout.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UnauthorizedAccessComponent } from './components/unauthorized-access/unauthorized-access.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { RoleService } from './services/role.service';
import { AssessmentConfigurationComponent } from './components/assessment-configuration/assessment-configuration.component';
import { AssessmentConfigurationService } from './services/assessment-configuration.service';
import { CompetencyDomainPipe } from './pipes/competency-domain.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetencyTitlePipe } from './pipes/competency-title.pipe';
import { LeftNavigationService } from './services/left-navigation.service';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";
import { MaturityConversionService } from './services/maturity-conversion.service';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FooterComponent } from './components/footer/footer.component';

const appRoutes: Routes=[
    { 
      path: '', 
      component: LoginComponent,
      canActivate: [LoginRedirect]
    },
    { 
      path: 'userHome', 
      component: UserHomeComponent,
      canActivate: [EnsureAuthenticated] 
    },
    { 
      path: 'dashboard/:engagementId/:engagementName', 
      component:DashboardComponent,
      canActivate: [EnsureAuthenticated]  
    },
    { 
      path: 'team/:engagementId/:engagementName/:teamId/:teamName', 
      component:TeamComponent,
      canActivate: [EnsureAuthenticated]  
    },
    { 
      path: 'product/:engagementId/:engagementName/:productId/:productName', 
      component:ProductComponent,
      canActivate: [EnsureAuthenticated]  
    },
    { 
      path: 'profile', 
      component: ProfileComponent,
      canActivate: [EnsureAuthenticated]  
    },
    { 
      path: 'securityQuestion/:email', 
      component: SecurityQuestionComponent
    },
    {
      path: 'passwordSetup/forgotPassword/token/:forgotPassword',
      component: ForgotPasswordComponent
    },
    {
      path: 'changePassword',
      component: ChangePasswordComponent,
      canActivate: [EnsureAuthenticated]  
    },
    { 
      path: 'unauthorizedAccess', 
      component: UnauthorizedAccessComponent,
      canActivate: [EnsureAuthenticated]  
    },
    { 
      path: 'administrator', 
      component: AdministratorComponent,
      canActivate: [EnsureAuthenticated]  
    },
    {
      path: 'assessment-configuration',
      component: AssessmentConfigurationComponent
    },
    { 
      path: '**', 
      redirectTo: ''
    }
]


@NgModule({
  declarations: [
    AppComponent,
    UserHomeComponent,
    LoginComponent,
    DashboardComponent,
    ProductComponent,
    TeamComponent,
    BreadcrumbComponent,
    NavBarComponent,
    ProfileComponent,
    SecurityQuestionComponent,
    FilterComponent,
    CompetencySortDirective,
    SortableColumnComponent,
    DomainSortDirective,
    SessionTimeoutComponent,
    ForgotPasswordComponent,
    UnauthorizedAccessComponent,
    ChangePasswordComponent,
    AdministratorComponent,
    ForgotPasswordComponent,
    AssessmentConfigurationComponent,
    CompetencyDomainPipe,
    CompetencyTitlePipe,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    StorageServiceModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    PickListModule, 
    PlotlyModule,
    ChartsModule,
    AngularMultiSelectModule,
    FormsModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    NgxTextOverflowClampModule,
    NgbModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptors, multi: true 
    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    },
    EngagementService, 
    AuthService, 
    EnsureAuthenticated, 
    LoginRedirect, 
    GlobalService, 
    CookieService,
    TeamService,
    AssessmentService,
    ProductService,
    PersonService,
    UserService,
    ProfileService,
    TeamReportsService,
    ProductReportsService,
    ExcelService,
    ReportsService,
    PracticeService,
    PracticeScoreService,
    AutoLogoutService,
    RoleService,
    AssessmentConfigurationService,
    LeftNavigationService,
    MaturityConversionService
  ],

  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
