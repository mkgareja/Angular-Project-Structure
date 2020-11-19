// external
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// internal
import { Constants, URL_ROUTES } from '@constant/constants';
import { ProductService } from '@services/product.service';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public itemProducts = [];
  public totalItems;
  public rowsOnPage = Constants.ROWS_ON_PAGE;
  public currentPage = Constants.CURRENT_PAGE;
  public maxSize = Constants.MAX_SIZE;
  public productForm: FormGroup;
  public isSubmitOrNot = true;
  public fileToUpload: File = null;
  products = {
    addProducts: 'productList.addProducts',
    addMultipleProducts: 'productList.addMultipleProducts'
  }
  public modalRef: BsModalRef;
  @ViewChild('deleteDialog', { static: false }) deleteDialog: TemplateRef<any>;
  @ViewChild('addProductDialog', { static: false })
  addProductDialog: TemplateRef<any>;
  @ViewChild('addMultipleProductDialog', { static: false })
  addMultipleProductDialog: TemplateRef<any>;

  public productId: any;
  page: any;
  hideShowCsvFile: boolean;
  constructor(
    private bsModalService: BsModalService,
    private productService: ProductService,
    private route: Router,
    private localStorage: LocalStorageService,
    activeRoute: ActivatedRoute
  ) {
    this.page = {
      pageNumber: 0,
      size: this.rowsOnPage,
    };
    this.itemProducts = activeRoute.snapshot.data.product.data;
    this.totalItems = activeRoute.snapshot.data.product.rowcount === 0 ? undefined : activeRoute.snapshot.data.product.rowcount;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });

    const categoryID = this.localStorage.readStorage(Constants.CATEGORYID);
    this.hideShowCsvFile = +categoryID === 4 ? true : false
    if (+categoryID === 4) {
      this.products = {
        addProducts: 'restuarantList.addProducts',
        addMultipleProducts: 'restuarantList.addMultipleProducts'
      }
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getProductList(this.page.pageNumber + 1);
  }

  onChangeSwitch(event, item) {
    const params = {
      status: event === true ? 1 : 0,
      id: item.pId,
    };
    this.productService.enableProduct(params).then((res: any) => { });
  }

  onDeleteProduct(productId) {
    this.productId = productId;
    this.modalRef = this.bsModalService.show(this.deleteDialog, {
      class: 'modal-xs',
      backdrop: 'static',
    });
  }

  clickActionDelete() {
    this.modalRef.hide();
    this.productService.deleteProduct(this.productId).then((res: any) => {
      this.ngOnInit();
    });
  }

  closeModal() {
    this.productId = '';
    this.modalRef.hide();
  }

  getProductList(currentPage) {
    this.productService
      .getProductsList(
        this.localStorage.readStorage(Constants.SID),
        currentPage,
      )
      .then((res: any) => {
        this.itemProducts = res.data;
        this.totalItems = res.rowcount === 0 ? undefined : res.rowcount;
      });
  }

  onEditeProduct(item) {
    this.route.navigate([`${URL_ROUTES.PRODUCT_ADD_EDIT}`], {
      queryParams: { productId: item.pId },
    });
  }

  onAddProduct() {
    this.modalRef = this.bsModalService.show(this.addProductDialog, {
      class: 'modal-xs',
      backdrop: 'static',
    });
  }

  onAddMultipleProduct() {
    this.modalRef = this.bsModalService.show(this.addMultipleProductDialog, {
      class: 'modal-xs',
      backdrop: 'static',
    });
  }

  clickScanAdd() {
    this.modalRef.hide();
    this.route.navigate([`${URL_ROUTES.PRODUCT_ADD_EDIT}`], {
      queryParams: { scan: "scan" },
    });
  }

  clickWithoutScan() {
    this.modalRef.hide();
    this.route.navigate([`${URL_ROUTES.PRODUCT_ADD_EDIT}`]);
  }

  onDownloadTemplate() {
    this.modalRef.hide();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.modalRef.hide();

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.productService.upload(formData).then((res: any) => {
      if (res.attachmentId) {
        const param = {
          attachmentId: res.attachmentId,
        };
        this.productService
          .uploadCSV(param, this.localStorage.readStorage(Constants.SID))
          .then((res: any) => { });
      }
    });
  }

  onProductDetail(item) {
    this.route.navigate([
      `${URL_ROUTES.PRODUCT_PRE_DETAIL}` +
      item.pId +
      `${URL_ROUTES.PRODUCT_DETAIL}`,
    ]);
  }
}
