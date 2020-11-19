import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { URL_ROUTES } from '@constant/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  public modalRef: BsModalRef;
  @ViewChild('logoutDialog', { static: false }) logoutDialog: TemplateRef<any>;
  @Input() event;
  @Input() todo;
  @Input() agenda;
  @Input() sideMenu;
  @Input() currentPage;
  activeMenu;
  constructor(private bsModalService: BsModalService, private localStorage: LocalStorageService,
    private router: Router) { }

  ngOnInit(): void {
  }

  activeClass(currentRoute, tag, parentRount: any = '') {
    currentRoute = currentRoute.toLowerCase().replace(' ', '-');
    if (parentRount) {
      parentRount = parentRount.toLowerCase().replace(' ', '-');
    }
    if (tag === 'li') {
      if (this.currentPage.includes(`${URL_ROUTES.STORE_HOME}`)) {
        this.currentPage = this.currentPage.replace(`${URL_ROUTES.STORE}`, '');
      }
      if (
        this.currentPage.includes('products') === true &&
        currentRoute === 'dashboard'
      ) {
        this.activeMenu = '';
        return 'active mm-active';
      }
      if (currentRoute === 'edit-store' && this.currentPage.includes('store/detail/')) {
        return 'active mm-active';
      }
      else if (
        this.currentPage.includes(currentRoute.toLowerCase()) === true
      ) {
        this.activeMenu = 'menuHover';
        return 'mm-active menu-open active';
      } else {
        return '';
      }
    } else if (tag === 'angle') {
      return 'fa fa-angle-left';
    } else if (tag === 'child1-li') {
      if (currentRoute === 'to-do') {
        currentRoute = 'todo';
      }
      if (currentRoute === 'housekeeping') {
        currentRoute = 'house-keeping';
      }

      if (
        this.currentPage.includes(currentRoute.toLowerCase()) === true &&
        this.currentPage.includes(parentRount.toLowerCase()) === true
      ) {
        this.activeMenu = 'menuHover';
        return 'mm-active menu-open active';
      } else {
        return '';
      }
    } else if (tag === 'child2-li') {
      if (currentRoute === 'certificates') {
        currentRoute = 'certifications';
      }
      if (currentRoute === 'sector-related') {
        currentRoute = 'sector';
        if (this.currentPage.includes('sector/usdaw')) {
          this.currentPage = this.currentPage.replace('usdaw/', '');
        }
      }
      if (currentRoute === 'interest-related') {
        currentRoute = 'interests';
        if (this.currentPage.includes('interests/usdaw')) {
          this.currentPage = this.currentPage.replace('usdaw/', '');
        }
      }
      if (currentRoute === 'courses') {
        if (this.currentPage.includes('courses/usdaw')) {
          this.currentPage = this.currentPage.replace('usdaw/', '');
        }
      }

      if (currentRoute === 'courses' || currentRoute === 'assessments') {
        if (this.currentPage.includes('training')) {
          this.currentPage = this.currentPage.replace('training', 'learning');
        }
      }
      if (
        this.currentPage.includes(currentRoute.toLowerCase()) === true &&
        this.currentPage.includes(parentRount.toLowerCase()) === true
      ) {
        return 'mm-active menu-open active';
      } else {
        return '';
      }
    } else if (tag === 'bedge') {
      if (
        currentRoute === 'to-do' ||
        currentRoute === 'calendar-management' ||
        currentRoute === 'agenda'
      ) {
        return '';
      } else {
        return 'hide';
      }
    } else {
      if (this.currentPage.includes(currentRoute.toLowerCase()) === true) {
        return 'mm-collapse mm-show';
      } else {
        return 'mm-collapse';
      }
    }
  }

  onLogout() {
    this.modalRef = this.bsModalService.show(this.logoutDialog, {
      class: 'modal-xs',
      backdrop: 'static',
    });
  }

  onClickActionLogout() {
    this.modalRef.hide();
    this.localStorage.clearStorage();
    this.router.navigate(['/']);
  }

  onCloseModal() {
    this.modalRef.hide();
  }
}
