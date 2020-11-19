// external
import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { LayoutService, LayoutStore } from 'angular-admin-lte';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// internal
import { URL_ROUTES, Constants } from '@constant/constants';
import { LocalStorageService } from '@services/local-storage.service';
import { StoreService } from '@services/store.service';
import { adminLteConf } from './admin-lte.conf';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public modalRef: BsModalRef;
  @ViewChild('logoutDialog', { static: false }) logoutDialog: TemplateRef<any>;
  title = 'ixoop-store-admin-angular';
  public isCustomLayout: boolean;
  public sideMenu = adminLteConf.sidebarLeftMenu;
  public currentPage = '';
  public storeDetails: any;
  isCollapsed = false;
  image: string;
  editAdmin: any;
  imageName: any;
  activeMenu: any = '';
  agenda = '-';
  event = '-';
  todo = '-';
  changePasswordRoute = URL_ROUTES.CHANGE_PASSWORD;
  public categoryID: any;
  subscription: any;

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public layoutStore: LayoutStore,
    public translate: TranslateService,
    private localStorage: LocalStorageService,
    public storeService: StoreService,
    private bsModalService: BsModalService,
  ) {
    translate.setDefaultLang('en');
  }

  async ngOnInit() {
    this.categoryID = this.localStorage.readStorage(Constants.CATEGORYID);
  }

  getStoredetails(sid) {
    this.storeService.getStoreDeatils(sid, false).then((res: any) => {
      this.storeDetails = res.data;
    });
  }


  collepsMenu() {
    $('li.menu1.mm-active.active').trigger('click');
    $('li.mm-active.active').trigger('click');
    $('li.menu-open')
      .find('a')
      .attr('aria-expanded', false);
    $('li.menu2.mm-active').removeClass('mm-active');
    $('li.menu1.mm-active').removeClass('mm-active');
    $('li.menu1.mm-active.active > a').trigger('click');
    $('li.menu1')
      .find('.menu-open')
      .removeClass('menu-open');
    $('ul.treeview-menu2')
      .find('.mm-active')
      .removeClass('mm-active');
    $('ul')
      .find('.mm-collapse')
      .removeClass('mm-show');
    this.cd.detectChanges();
  }
  ngAfterViewInit() {
    this.router.events.subscribe((val) => {
      this.categoryID = this.localStorage.readStorage(Constants.CATEGORYID);
      if (val instanceof NavigationStart) {
        if (val.url === '/' || val.url === `/${URL_ROUTES.STORE_HOME}` || val.url === `/${URL_ROUTES.CHANGE_PASSWORD}` ||
          val.url === `/${URL_ROUTES.PRODUCT_ADD_EDIT}`) {
          this.storeService.emitMenuChangeEvent(Number(this.categoryID));
          this.subscription = this.storeService.getMenuChangeEmitter().subscribe(res => {
            this.sideMenu = res;
          })
          this.getStoredetails(this.localStorage.readStorage(Constants.SID));
        } else {
          if (val instanceof NavigationStart) {
            if (val.url !==
              `/${URL_ROUTES.STORE_DETAIL}` + this.localStorage.readStorage(Constants.SID)) {
              if (this.localStorage.readStorage(Constants.SID)) {
                this.getStoredetails(this.localStorage.readStorage(Constants.SID));
              }
            }
          }
        }
        if (val.url === '/' && this.localStorage.readStorage(Constants.TOKEN)
        ) {
          this.router.navigate([`${URL_ROUTES.STORE_HOME}`]);
        }
        if ($('.sidebar-mini').hasClass('sidebar-collapse')) {
          setTimeout(() => {
            this.collepsMenu();
          }, 500);
        }
        if (
          val &&
          val.url.includes('calendar/edit') &&
          $('.Content3').height() == 0
        ) {
          $('.Content3').height(320);
          $('.Content3').attr('aria-expanded', true);
          $('.Content3')
            .parent()
            .find('a')
            .first()
            .trigger('click');
        }
        this.cd.detectChanges();
        $('ul')
          .find('.treeview-menu2')
          .removeAttr('style');
      }
      if (val instanceof NavigationEnd) {

        const url = this.router.url.substr(1);
        this.currentPage = url;
        this.storeService.emitMenuChangeEvent(Number(this.categoryID));
        this.subscription = this.storeService.getMenuChangeEmitter().subscribe(res => {
          this.sideMenu = res;
        })
      }
    });
    this.layoutService.isCustomLayout.subscribe((value: boolean) => {
      this.isCustomLayout = value;

      this.cd.detectChanges();
      $('#side-menu').metisMenu({
        toggle: true, // disable the auto collapse. Default: true.
      });
    });
    this.layoutStore.isSidebarLeftCollapsed.subscribe((val) => {
      this.collepsMenu();
    });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
