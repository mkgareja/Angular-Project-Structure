import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { UtilityService } from './utility.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
export class JReponse<T> {
  message?: string;
  data?: JData<T>;
}

export class JData<T> {
  list?: Array<T> = [];
  pagination?: Pagination;
}

export class Pagination {
  currentPage: number;
  offset: number;
  perPage: number;
  totalPages: number;
  viewAll?: boolean;
  constructor() {
    this.currentPage = 1;
    this.perPage = 10;
    this.viewAll = false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {

  private hostUrl = environment.APP_URL;

  constructor(
    public http: HttpClient,
    private router: Router,
    private utility: UtilityService,
    private localStorage: LocalStorageService,
  ) { }

  /**
   * getHeader(headerOptions, doNotSendAuthorizationParam) => set header option with authorization token base on param
   * @param headerOptions in headeroption
   * @param doNotSendAuthorizationParam in authorization sent or not
   */
  getHeader(headerOptions, doNotSendAuthorizationParam) {
    const headerParams = {};
    if (doNotSendAuthorizationParam !== true) {
      // tslint:disable-next-line: no-string-literal
      headerParams['authorization'] = this.localStorage.readStorage('token');
    }
    if (headerOptions) {
      Object.assign(headerParams, headerOptions);
    }
    const headers = new HttpHeaders(headerParams);
    return { headers };
  }

  /**
   * post(url, body, doNotSendAuthorizationParam?, headerOptions?) => post method base on params
   * @param url in url
   * @param body in body param
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  post(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
      this.http
        .post(`${this.hostUrl}${url}`, body, options)
        .pipe(
          map(res => res),
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          },
        );
    });
  }

  /**
   * get(url, doNotSendAuthorizationParam?, headerOptions?) => get method base on params
   * @param url in url
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  get(url: string, doNotSendAuthorizationParam: boolean = false, headerOptions: any = {}) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
      this.http
        .get(`${this.hostUrl}${url}`, options)
        .pipe(
          map(res => res),
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          },
        );
    });
  }

  /**
   * get(url, doNotSendAuthorizationParam?, headerOptions?) => get method base on params
   * @param url in url
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  getNoURL(url: string, doNotSendAuthorizationParam: boolean = false, headerOptions: any = {}) {
    return new Promise((resolve, reject) => {
      // const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
      this.http
        .get(`${url}`)
        .pipe(
          map(res => res),
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          },
        );
    });
  }

  /**
   * put(url, body, doNotSendAuthorizationParam?, headerOptions?) => put method base on params
   * @param url in url
   * @param body in body param
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  put(url, body: any, headerOptions: any = {}, doNotSendAuthorizationParam: boolean = false) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
      this.http
        .put(`${this.hostUrl}${url}`, body, options)
        .pipe(
          map(res => res),
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          },
        );
    });
  }

  /**
   * delete(url, doNotSendAuthorizationParam?, headerOptions?) => delete method base on params
   * @param url in url
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  delete(url, headerOptions: any = {}, doNotSendAuthorizationParam: boolean = false) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
      this.http.delete(`${this.hostUrl}${url}`, options).pipe(map((res) => {
        return res;
      })).subscribe((res) => {
        resolve(res);
      }, (err) => {
        this.handleError(err);
        reject(err);
      });
    });
  }

  /**
   * handleError(err) => handle error message
   * @param err in arr object
   */
  handleError(err) {
    if (err.status === 400) {
      const error = (err.error.error || err.error.message) ? (err.error.error || err.error.message) : 'Internal server error!';
      this.utility.showErrorToast(error);
      this.utility.hideLoading();
    } else if (err.status === 401) {
      const error = err.error.error ? err.error.error : 'Session Expired!';
      this.utility.showErrorToast(error);
      this.utility.hideLoading();
      this.localStorage.clearStorage();
      this.router.navigate(['/']);
    } else if (err.status === 500) {
      const error = err.error.error ? err.error.error : 'Internal server error!';
      this.utility.showErrorToast(error);
      this.utility.hideLoading();
    }
  }

}
