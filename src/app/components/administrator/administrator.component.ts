import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { EngagementService } from '../../services/engagement.service';
import { PersonService } from '../../services/person.service';
import { features } from '../../utility/features';
declare var jQuery: any;

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  UpdatedAdminSuccessMessage: String = 'none';
  UpdatedDefaultAdminAlertMessage: String = 'none';
  UpdatedDefaultAdminStatusErrorMessage: String = 'none';
  SelfDeleteAlertMessage: String = 'none';
  DefaultAdminDeleteAlertMessage: String = 'none';
  userSelfUpdateMessage: String = 'none';
  ModalAdminSuccessMessage: String;
  selectedUserForDelete: String;
  hideAdminModal: boolean = false;
  selectedAdminName: String;
  allAdmins;
  saveAdminID;
  saveAdminName;
  users;
  editUser;
  pages;
  page: number = 0;
  pageNumber;
  userName;
  name;
  user: User = new User();
  userErrors;
  errorUserCreation: string = 'none';
  errorUserUpdation: string = 'none';
  errorPasswords: string = 'none';
  administratorPageLanded: boolean = true;
  administratorTitle: string = 'Administrator';
  legendsLink: boolean = true;
  userCreatedSuccessMessage: string = 'none';
  userUpdatedSuccessMessage: string = 'none';
  userDeletedSuccessMessage: string = 'none';
  roles;
  roleId: number;
  adminPassword;
  isPasswordsError: boolean = false;
  competencyCreatedMessage: string = 'none';
  competencyUpdatedMessage: string = 'none';
  showSideNav: boolean = false;
  userRoleTitle: string;
  totalElements: number;
  pageSize: number = 10;
  currentPagePagination = 0;
  features: any;
  modifiedUsersList: User[] = [];
  oldStatus: String;
  displayInactiveChecked: string = 'N';

  constructor(
    private _userService: UserService,
    private _roleService: RoleService,
    private autoLogoutService: AutoLogoutService,
    private _engagementService: EngagementService,
    private _personService: PersonService
  ) {
    this.features = features;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('username');
    this.getAllUsersInPagination(this.page);
    this.setInitialValuePagination(this.page);
    this.getAllRoleIdAndName();
    this.user.username = '';
    this.user.email = '';
    this.user.adminUsername = '';
    this.user.adminPassword = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.role['id'] = null;
    this.user.role['name'] = null;
    this.user.newPassword = '';
    this.user.confirmPassword = '';
    this.user.adminPassword = '';
  }

  getAllUsersInPagination(page: number) {
    console.log('Page Number::' + page);
    this._userService.getAllUsersInPagination(page).subscribe(
      data => {
        this.users = data['content'];
        console.log(this.users);
        this.displayUsersList(this.displayInactiveChecked);
        //this.pages = new Array(data['totalPages']);
        this.pageNumber = data['totalPages'];
        console.log(this.pageNumber);
      },
      error => {}
    );
  }

  displayUsersList(selected: String) {
    if (selected === 'Y') {
      for (let i = 0; i < this.users.length; i++) {
        if (
          this.users[i].isActive === 'Y' ||
          this.users[i].isActive === 'Active'
        )
          this.users[i].isActive = 'Active';
        else this.users[i].isActive = 'InActive';
      }
      this.modifiedUsersList = this.users;
    } else {
      this.modifiedUsersList = [];
      for (let i = 0; i < this.users.length; i++) {
        if (
          this.users[i].isActive === 'Y' ||
          this.users[i].isActive === 'Active'
        )
          this.users[i].isActive = 'Active';
        else this.users[i].isActive = 'InActive';
        if (this.users[i].isActive === 'Active') {
          this.modifiedUsersList.push(this.users[i]);
        }
      }
    }
  }

  displayUsers(event) {
    if (event.currentTarget.checked) {
      this.displayInactiveChecked = 'Y';
      this.displayUsersList(this.displayInactiveChecked);
    } else {
      this.displayInactiveChecked = 'N';
      this.displayUsersList(this.displayInactiveChecked);
    }
  }

  setInitialValuePagination(page: number) {
    this._userService.getAllUsersInPagination(page).subscribe(
      data => {
        this.totalElements = data['totalElements'];
        this.pages = this._engagementService.getPager(
          this.totalElements,
          0,
          this.pageSize
        ).pages;
      },
      error => {}
    );
  }

  createUser() {
    console.log('Creating new User::' + this.user.role['name']);
    console.log('Creating new User::' + JSON.stringify(this.user));
    this.user.adminUsername = sessionStorage.getItem('username');
    if (this.user.role['name'] === 'ADMIN') {
      this._roleService.getRoleIdByRoleName('ADMIN').subscribe(
        data => {
          this.roleId = data['id'];
          this.user.role['id'] = this.roleId;
          this._userService.createUser(this.user).subscribe(
            data => {
              this.closeModel('cancel-btn-create-user');
              this.page = 0;
              this.getAllUsersInPagination(this.page);
              //this.pages = this._engagementService.getPager(this.totalElements, 0, this.pageSize).pages;
              this.setInitialValuePagination(this.page);
              this.currentPagePagination = 0;
              this.userCreatedSuccessMessage = 'block';
              setTimeout(() => {
                this.userCreatedSuccessMessage = 'none';
              }, 10000);
            },
            error => {
              this.userErrors = error.error;
              this.user.adminPassword = '';
              this.errorUserCreation = 'block';
            }
          );
        },
        error => {}
      );
    } else if (this.user.role['name'] === 'STRATEGIST') {
      this._roleService.getRoleIdByRoleName('STRATEGIST').subscribe(
        data => {
          this.roleId = data['id'];
          this.user.role['id'] = this.roleId;

          this._userService.createUser(this.user).subscribe(
            data => {
              this.closeModel('cancel-btn-create-user');
              this.page = 0;
              this.getAllUsersInPagination(this.page);
              this.userCreatedSuccessMessage = 'block';

              setTimeout(() => {
                this.userCreatedSuccessMessage = 'none';
              }, 10000);
            },
            error => {
              this.userErrors = error.error;
              this.user.adminPassword = '';
              this.errorUserCreation = 'block';
            }
          );
        },
        error => {}
      );
    } else {
      this._userService.createUser(this.user).subscribe(
        data => {
          this.closeModel('cancel-btn-create-user');
          this.getAllUsersInPagination(this.page);
          this.userCreatedSuccessMessage = 'block';

          setTimeout(() => {
            this.userCreatedSuccessMessage = 'none';
          }, 10000);
        },
        error => {
          this.userErrors = error.error;
          this.user.adminPassword = '';
          this.errorUserCreation = 'block';
        }
      );
    }
  }

  getUserDetails(username: String) {
    this.userErrors = '';
    this.errorUserUpdation = '';
    this.errorPasswords = '';
    this.user.newPassword = '';
    this.user.confirmPassword = '';
    this.user.adminPassword = '';
    this._userService.getUserByUserName(username).subscribe(
      data => {
        this.editUser = data;
        this.user.id = this.editUser.id;
        if (this.editUser.isActive === 'Y') this.user.isActive = 'Active';
        else this.user.isActive = 'InActive';
        this.user.username = this.editUser.username;
        this.user.email = this.editUser.email;
        this.user.adminUsername = sessionStorage.getItem('username');
        this.user.adminPassword = this.adminPassword;
        this.user.firstName = this.editUser.firstName;
        this.user.lastName = this.editUser.lastName;
        this.user.role = this.editUser.role;
        this.user.firstLogin = this.editUser.firstLogin;
        this.user.password = this.editUser.password;
        this.user.isDefaultAdmin = this.editUser.isDefaultAdmin;
        this.oldStatus = this.user.isActive;
        if (this.user.role['name'] === 'ADMIN') {
          this._roleService.getRoleIdByRoleName('ADMIN').subscribe(data => {
            this.user.role['id'] = data['id'];
          });
        } else if (this.user.role['name'] === 'STRATEGIST') {
          this._roleService
            .getRoleIdByRoleName('STRATEGIST')
            .subscribe(data => {
              this.user.role['id'] = data['id'];
            });
        }
      },
      error => {}
    );
  }

  sendDataToModal(username: String) {
    this.selectedUserForDelete = username;
  }

  deleteUser(username: String) {
    console.log('<<<<<<<<<<< delete');
    console.log(this.modifiedUsersList);
    // If an admin is trying to delete himself
    if (this.user.username === sessionStorage.getItem('username')) {
      this.SelfDeleteAlertMessage = 'block';
      setTimeout(() => {
        this.SelfDeleteAlertMessage = 'none';
      }, 10000);
      return;
    }

    //If an admin is trying to delete default admin
    if (this.user.isDefaultAdmin === 'Y') {
      // Default admin
      setTimeout(() => {
        let element = document.getElementById('cancel-btn-edit-user') as any;
        element.click();
      }, 10000);
      this.DefaultAdminDeleteAlertMessage = 'block';
      setTimeout(() => {
        this.DefaultAdminDeleteAlertMessage = 'none';
      }, 10000);
      return;
    }

    //if an admin is trying to delete another admin or strategist
    if (
      this.user.isDefaultAdmin != 'Y' &&
      this.user.username != sessionStorage.getItem('username')
    ) {
      console.log('deleting the user:' + this.user.username);
      this._userService.deleteUser(username).subscribe(
        data => {
          this.closeModel('cancel-btn-delete-admin');
          this.userDeletedSuccessMessage = 'block';
          setTimeout(() => {
            this.userDeletedSuccessMessage = 'none';
          }, 10000);
          this.getAllUsersInPagination(this.page);
        },
        error => {}
      );
    }
  }

  saveUser() {
    console.log('Role Name' + this.user.role['name']);
    if (this.user.role['name'] === 'ADMIN') {
      this._roleService.getRoleIdByRoleName('ADMIN').subscribe(data => {
        this.user.role['id'] = data['id'];
      });
    } else if (this.user.role['name'] === 'STRATEGIST') {
      this._roleService.getRoleIdByRoleName('STRATEGIST').subscribe(data => {
        this.user.role['id'] = data['id'];
      });
    }

    // If an user is trying to change his own status, then display the message "You do not have permission to edit this profile."
    if (this.user.username === sessionStorage.getItem('username')) {
      if (this.oldStatus != this.user.isActive) {
        this.userSelfUpdateMessage = 'block';
        setTimeout(() => {
          this.userSelfUpdateMessage = 'none';
        }, 10000);
        return;
      }
    }

    //If admin is trying to edit default admin profile
    if (this.user.isDefaultAdmin === 'Y') {
      // Default admin

      //If admin changes the status from active to inactive for default admin user
      if (this.oldStatus != this.user.isActive) {
        this.UpdatedDefaultAdminStatusErrorMessage = 'block';
        setTimeout(() => {
          this.UpdatedDefaultAdminStatusErrorMessage = 'none';
        }, 10000);
        return;
      } else {
        //If admin edit any other fields of default admin apart active/inactive status
        this.UpdatedDefaultAdminAlertMessage = 'block';
        setTimeout(() => {
          this.UpdatedDefaultAdminAlertMessage = 'none';
        }, 10000);
        return;
      }
    }

    //If normal admin is trying to edit other admin  profile, then do not allow him to update it.
    /*if(this.user.isDefaultAdmin == 'Y' && this.user.username != sessionStorage.getItem("username")  ){
      this.UpdatedDefaultAdminAlertMessage = "block";
      setTimeout(() => {
        this.UpdatedDefaultAdminAlertMessage = "none";
      }, 10000);
      return ;
    }*/
    console.log('Before Saving User:' + JSON.stringify(this.user));
    if (this.user.isActive === 'Active') this.user.isActive = 'Y';
    else if (this.user.isActive === 'InActive') this.user.isActive = 'N';
    console.log('Post Saving User:' + JSON.stringify(this.user));
    //Normal admin can update other admin/strategist user details.
    //Default admin can update his own profile.
    this._userService.saveUser(this.user).subscribe(
      data => {
        this.closeModel('cancel-btn-edit-user');
        //If logged in user is trying to update his own details, then logout from system.
        if (this.user.username === sessionStorage.getItem('username')) {
          this._userService.setLoggedInAccountUpdate(true);
          this.autoLogoutService.logout('false');
        } else {
          this.getAllUsersInPagination(this.page);
          this.userUpdatedSuccessMessage = 'block';
          setTimeout(() => {
            this.userUpdatedSuccessMessage = 'none';
          }, 10000);
        }
      },
      error => {
        this.userErrors = error.error;
        this.user.adminPassword = '';
        this.user.newPassword = '';
        this.user.confirmPassword = '';
        this.errorUserUpdation = 'block';
        if (error.error['passwords'] == null) this.isPasswordsError = false;
        else {
          this.isPasswordsError = true;
          this.errorPasswords = 'block';
        }
      }
    );
  }

  receiveMessage($event) {
    let competencyNewOrUpdate = $event;
    if (competencyNewOrUpdate === 'New') {
      this.competencyCreatedMessage = 'block';
      setTimeout(() => {
        this.competencyCreatedMessage = 'none';
      }, 10000);
    } else if (competencyNewOrUpdate === 'Update') {
      this.competencyUpdatedMessage = 'block';
      setTimeout(() => {
        this.competencyUpdatedMessage = 'none';
      }, 10000);
    }
  }

  getAllRoleIdAndName() {
    this._roleService.getAllRoleIdAndName().subscribe(
      data => {
        this.roles = data;
      },
      error => {}
    );
  }

  administratorDefaults() {
    this.userErrors = '';
    this.user.username = '';
    this.user.email = '';
    this.user.adminUsername = '';
    this.user.adminPassword = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.role['id'] = null;
    this.user.role['name'] = null;
    this.userRoleTitle = 'Select User Role';
  }

  onRoleSelection(event) {
    let selectedOptions = document.getElementById('role') as HTMLSelectElement;
    let selectedIndex = selectedOptions.selectedIndex;
    this.userRoleTitle = (selectedOptions[
      selectedIndex
    ] as HTMLOptionElement).text;
  }

  toggleShortenUserText(id: number) {
    event.stopPropagation
      ? event.stopPropagation()
      : (event.cancelBubble = true);
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        this.users[i].isTextShorten = !this.users[i].isTextShorten;
      }
    }
  }

  displayUserCreationUpdationErrorToggle() {
    this.errorUserCreation = 'none';
    this.errorUserUpdation = 'none';
  }

  displayUserPasswordsToggle() {
    this.errorPasswords = 'none';
  }

  closeModel(buttonId: string) {
    let element = document.getElementById(buttonId) as any;
    element.click();
  }

  addKeyValue(obj, key, data) {
    obj[key] = data;
  }

  setPageIndex(i: number) {
    if (this.page != i) {
      this.page = i;
      this.pages = this._engagementService.getPager(
        this.totalElements,
        i,
        this.pageSize
      ).pages;
      if (i == 0) this.currentPagePagination = 0;
      else
        this.currentPagePagination = this._engagementService.getPager(
          this.totalElements,
          i,
          this.pageSize
        ).currentPage;
      this.getAllUsersInPagination(this.page);
    }
  }

  setFirstPageIndex() {
    if (this.page != 0) {
      this.page = 0;
      this.pages = this._engagementService.getPager(
        this.totalElements,
        0,
        this.pageSize
      ).pages;
      this.currentPagePagination = 0;
      this.getAllUsersInPagination(this.page);
    }
  }

  setNextPageIndex() {
    if (this.page < this.pageNumber - 1) {
      this.pages = this._engagementService.getPager(
        this.totalElements,
        this.currentPagePagination + 1,
        this.pageSize
      ).pages;
      this.page = this.currentPagePagination + 1;
      this.currentPagePagination = this._engagementService.getPager(
        this.totalElements,
        this.currentPagePagination + 1,
        this.pageSize
      ).currentPage;
      this.getAllUsersInPagination(this.page);
    }
  }

  setPreviousPageIndex(i: number) {
    if (this.page > 0) {
      this.pages = this._engagementService.getPager(
        this.totalElements,
        this.currentPagePagination - 1,
        this.pageSize
      ).pages;
      this.page = this.currentPagePagination - 1;
      if (i - 1 == 0) this.currentPagePagination = 0;
      else
        this.currentPagePagination = this._engagementService.getPager(
          this.totalElements,
          this.currentPagePagination - 1,
          this.pageSize
        ).currentPage;
      this.getAllUsersInPagination(this.page);
    }
  }

  setLastPageIndex() {
    if (this.page != this.pageNumber - 1) {
      this.page = this.pageNumber - 1;
      this.pages = this._engagementService.getPager(
        this.totalElements,
        this.page,
        this.pageSize
      ).pages;
      this.currentPagePagination = this._engagementService.getPager(
        this.totalElements,
        this.page,
        this.pageSize
      ).currentPage;
      this.getAllUsersInPagination(this.page);
    }
  }

  configureAdmins() {
    console.log(sessionStorage.getItem('isDefaultAdmin'));
    this.saveAdminID = '';
    this._personService.findAllAdmins().subscribe(
      data => {
        this.allAdmins = data;
        let element = document.getElementById('cancel-btn-delete-admin') as any;
        element.click();
        let element1 = document.getElementById('cancel-btn-edit-user') as any;
        element1.click();
      },
      error => {}
    );
  }

  SaveAdmin() {
    if (this.saveAdminID === null) {
      alert('Please Select Default Admin to Save');
      return;
    }
    this._personService.saveAdminDetails(this.saveAdminID).subscribe(
      data => {
        this.selectedAdminName = this.saveAdminName;
        this.closeModel('cancel-btn-edit-admin');
        this.UpdatedAdminSuccessMessage = 'block';
        setTimeout(() => {
          this.UpdatedAdminSuccessMessage = 'none';
          this.ModalAdminSuccessMessage = 'none';
        }, 10000);
      },
      error => {
        //alert('error while saving') ;
      }
    );
  }

  selectedAdmin(id: number, username: string) {
    this.saveAdminID = id;
    this.saveAdminName = username;
  }

  CancelSelectedAdmin() {
    this.saveAdminID = '';
    this.saveAdminName = '';
  }
}
