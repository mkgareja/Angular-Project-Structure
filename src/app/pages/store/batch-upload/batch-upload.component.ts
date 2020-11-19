import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '@services/product.service';
import { LocalStorageService } from '@services/local-storage.service';
import { Constants } from '@constant/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import validbarcode from 'barcode-validator';
import { debounce } from 'lodash';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent implements OnInit {
  upcCodeList: any[] = [];
  finalUpcCodeList: any[] = [];
  @ViewChild('scanUpcCode') scanUpcCode: ElementRef;
  public upcForm: FormGroup;
  sid: any;
  upcCodeIndex: any;
  public modalRef: BsModalRef;
  @ViewChild('deleteDialog', { static: false }) deleteDialog: TemplateRef<any>;
  constructor(
    public translation: TranslateService,
    private productService: ProductService,
    private bsModalService: BsModalService,
    private localStorage: LocalStorageService) {
    this.sid = this.localStorage.readStorage(Constants.SID);
  }

  ngOnInit() {
    this.initializeProductForm();
  }

  initializeProductForm() {
    this.upcForm = new FormGroup({
      upcCode: new FormControl(null)
    });
  }

  ngAfterViewInit() {
    this.scanUpcCode.nativeElement.focus();
  }

  processBarCode(event) {
    if (this.scanUpcCode.nativeElement.value.trim() !== '') {
      console.log('bracode process key ->', this.scanUpcCode.nativeElement.value.trim());
      this.validUpcCode(this.scanUpcCode.nativeElement.value.trim());
      this.scanUpcCode.nativeElement.value = '';

    }
  }

  getProductDetailByUpcCode(upcCodeItems) {
    const params = {
      upc: upcCodeItems,
      isProcess: true,
      sid: this.sid
    };
    this.productService.scanData(params).then((res: any) => {
      if (res) {
        this.clear();
      }
    }, err => { });
  }

  submit() {
    this.getProductDetailByUpcCode(this.finalUpcCodeList);
  }

  clear() {
    this.upcCodeList = [];
    this.finalUpcCodeList = [];
  }

  validUpcCode(value) {
    if (this.upcCodeList.some(x => x.code === value) === false) {
      let isValid = validbarcode(this.scanUpcCode.nativeElement.value);
      if (!isValid) {
        isValid = validbarcode(+this.scanUpcCode.nativeElement.value);
      }
      this.upcCodeList.push({ code: value, valid: isValid });
      this.finalUpcCodeList.push(value);
    }
  }

  openDeleteDialog(i) {
    this.upcCodeIndex = i;
    this.modalRef = this.bsModalService.show(this.deleteDialog, {
      class: 'modal-xs',
      backdrop: 'static',
    });
  }

  clickActionDelete() {
    this.upcCodeList.splice(this.upcCodeIndex, 1);
    this.finalUpcCodeList.splice(this.upcCodeIndex, 1);
    this.modalRef.hide();
  }

  closeModal() {
    this.upcCodeIndex = '';
    this.modalRef.hide();
  }
}





