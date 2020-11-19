// external
import { Injectable, EventEmitter } from '@angular/core';

// internal
import { ApiService } from './api.service';
import { API } from '@routes/api-routes';
import { adminLteConf } from '../admin-lte.conf';
import { URL_ROUTES, Constants } from '@constant/constants';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  menuchange: BehaviorSubject<any> = new BehaviorSubject(null);
  public sideMenu = adminLteConf.sidebarLeftMenu;
  constructor(private apiService: ApiService, private localStorage: LocalStorageService) { }

  getStoreDeatils(id, isShowLoader = true) {
    return this.apiService.get(
      `${API.STORE_ROUTES.getStore}${id}`,
      true,
      false,
      isShowLoader
    );
  }

  editStore(params, id) {
    return this.apiService.post(
      `${API.STORE_ROUTES.getStore}${id}`,
      params,
      true,
    );
  }

  emitMenuChangeEvent(categoryID) {
    this.sideMenu = [
      {
        label: categoryID === 4 ? 'Dishes' : 'Products',
        route: URL_ROUTES.STORE_HOME,
        iconClasses: categoryID === 4 ? 'fa fa-cutlery' : 'fa fa-shopping-cart',
      },
      {
        label: 'Edit Store',
        route:
          URL_ROUTES.STORE_DETAIL +
          this.localStorage.readStorage(Constants.SID),
        iconClasses: 'fa fa-tachometer',
      },
      {
        label: 'Batch Upload',
        route: URL_ROUTES.BATCH_UPLOAD,
        iconClasses: 'fa fa-upload',
      },
      {
        label: 'Change Password',
        route: URL_ROUTES.CHANGE_PASSWORD,
        iconClasses: 'fa fa-key',
      },
      {
        label: 'Logout',
        route: URL_ROUTES.LOGIN,
        iconClasses: 'fa fa-sign-out',
      },
    ];
    this.menuchange.next(this.sideMenu);
  }

  getMenuChangeEmitter() {
    return this.menuchange;
  }
}
