// external
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// internal
import { Constants, URL_ROUTES } from '@constant/constants';
import { ProductService } from '@services/product.service';
import { FormService } from '@services/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') photoInput;
  @ViewChild('scanUpcCode') scanUpcCode: ElementRef;
  public productForm: FormGroup;
  public messageList: any = {
    productImage: '',
    name: '',
    price: '',
    upcCode: '',
    description: '',
  };
  public fileToUpload: File = null;
  public imgURL: any;
  public imageArray = [];
  public displayImage = [];
  public sid: any;
  public categoryID: any;
  public product: any;
  public headerTitle = 'Add';
  public productId: any;
  public productDetails: any;
  public productSaveData: any;
  public isImage = true;
  type = '';
  productKey = {
    addTitle: 'restuarantAdd.addTitle',
    editTitle: 'restuarantAdd.editTitle',
    nameLable: 'restuarantAdd.nameLable',
    descriptionLable: 'restuarantAdd.descriptionLable',
    priceLable: 'restuarantAdd.priceLable',
  };

  constructor(
    public translation: TranslateService,
    private formService: FormService,
    private router: Router,
    private productService: ProductService,
    public activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private util: UtilityService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty('productId')) {
        this.productId = params.productId;
        if (this.productId) {
          this.headerTitle = 'Edit';
          this.getProductDetails(this.productId);
        } else {
          this.headerTitle = 'Add';
        }
      } else {
        this.type = params.scan;
      }
    });
    this.sid = this.localStorage.readStorage(Constants.SID);
    this.categoryID = this.localStorage.readStorage(Constants.CATEGORYID);
    if (+this.categoryID === 4) {
      this.productKey = {
        addTitle: 'restuarantAdd.addTitle',
        editTitle: 'restuarantAdd.editTitle',
        nameLable: 'restuarantAdd.nameLable',
        descriptionLable: 'restuarantAdd.descriptionLable',
        priceLable: 'restuarantAdd.priceLable',
      };
    } else {
      this.productKey = {
        addTitle: 'productAdd.addTitle',
        editTitle: 'productAdd.editTitle',
        nameLable: 'productAdd.nameLable',
        descriptionLable: 'productAdd.descriptionLable',
        priceLable: 'productAdd.priceLable',
      };
    }
    this.initializeProductForm();
    this.initializeMessages();
  }

  initializeProductForm() {
    this.productForm = new FormGroup({
      productImage: new FormControl(null, Validators.required),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
      ]),
      upcCode: new FormControl(null, [
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(2000),
      ]),
    });
    if (this.categoryID === '4') {
      this.productForm.controls.upcCode.setValidators(null);
    }

  }

  ngAfterViewInit() {
    if (this.type === Constants.SCAN) {
      this.scanUpcCode.nativeElement.focus();
    }
  }

  processBarCode(event) {
    if (this.scanUpcCode.nativeElement.value.trim() !== '') {
      console.log('bracode process key ->', this.scanUpcCode.nativeElement.value.trim());
      this.getProductDetailByUpcCode(this.scanUpcCode.nativeElement.value);
    }
  }

  initializeMessages() {
    this.messageList.productImage = {
      required: this.translation.instant('productAdd.imageRequired'),
    };
    this.messageList.name = {
      required: this.translation.instant('productAdd.nameRequired'),
      minlength: this.translation.instant('productAdd.nameMin'),
      maxlength: this.translation.instant('productAdd.nameMax'),
    };
    this.messageList.price = {
      required: this.translation.instant('productAdd.priceRequired'),
      minlength: this.translation.instant('productAdd.priceMin'),
      maxlength: this.translation.instant('productAdd.priceMax'),
    };
    this.messageList.description = {
      required: this.translation.instant('productAdd.descriptionRequired'),
      minlength: this.translation.instant('productAdd.descriptionMin'),
      maxlength: this.translation.instant('productAdd.descriptionMax'),
    };
  }

  getProductDetails(id) {
    this.productService.getProductsDetails(id).then((res: any) => {
      this.productDetails = res.product;
      this.setEditForm(res.product);
    });
  }

  setEditForm(data) {
    if (this.type === Constants.SCAN) {
      if (data.images) {
        const editImageArray = [];
        data.images.forEach((element, index) => {
          if (element.split('/')[0] === 'https:') {
            editImageArray.push({
              image: element,
              name: index,
            });
          }
        });
        this.displayImage = editImageArray;
        this.imageArray = [];
        if (this.displayImage.length >= Constants.MAX_IMAGE) {
          this.isImage = false;
        } else {
          this.isImage = true;
        }
      }
    } else {
      if (data.image) {
        const editImageArray = [];
        data.image.forEach((element, index) => {
          editImageArray.push({
            image: element.thumb,
            name: index,
          });
        });
        const attachmentImageArray = [];
        data.image.forEach((element, index) => {
          attachmentImageArray.push({
            name: index,
            attachment: element.id,
          });
        });
        this.displayImage = editImageArray;
        this.imageArray = attachmentImageArray;
        if (this.displayImage.length >= Constants.MAX_IMAGE) {
          this.isImage = false;
        } else {
          this.isImage = true;
        }
      }
    }
    data.price = this.type === Constants.SCAN ? null : data.price;
    this.productForm = new FormGroup({
      productImage: new FormControl(this.displayImage.length > 0 ? true : null, Validators.required),
      name: new FormControl(data.productname, [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
      price: new FormControl(data.price, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]),
      upcCode: new FormControl(data.upcCode, []),
      description: new FormControl(data.description, [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]),
    });
    if (this.categoryID === '4') {
      this.productForm.controls.upcCode.setValidators(null);
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.displayImage.push({
        image: reader.result,
        name: this.fileToUpload.name,
      });
      if (this.displayImage.length >= Constants.MAX_IMAGE) {
        this.isImage = false;
      } else {
        this.isImage = true;
      }
    };
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.productService.upload(formData).then((res: any) => {
      if (res.attachmentId) {
        this.imageArray.push({
          attachment: res.attachmentId,
          name: this.fileToUpload.name,
        });
        this.productForm.controls.productImage.setValue(this.imageArray.length > 0 ? true : null);
        this.photoInput.nativeElement.value = '';
      }
    });
  }

  onRemoveImage(imageIndex) {
    this.displayImage.splice(imageIndex, 1);
    this.imageArray.splice(imageIndex, 1);

    if (this.displayImage.length >= Constants.MAX_IMAGE) {
      this.isImage = false;
    } else {
      this.isImage = true;
    }
    this.productForm.controls.productImage.setValue(this.displayImage.length > 0 ? true : null);
  }

  onSubmit() {
    if (this.type === Constants.SCAN) {
      this.convertImageUrl();
    } else {
      this.saveProduct();
    }
  }

  saveProduct() {
    this.formService.markFormGroupTouched(this.productForm);
    if (this.productForm.invalid) {
      return;
    }
    const finalAttachment = [];
    this.imageArray.forEach((element) => {
      finalAttachment.push(element.attachment);
    });
    if (this.productId) {
      this.productSaveData = {
        pId: this.productId,
        productName: this.productForm.value.name,
        UPCCode: this.productForm.value.upcCode,
        price: this.productForm.value.price,
        description: this.productForm.value.description,
        images: finalAttachment,
      };
    } else {
      this.productSaveData = {
        productName: this.productForm.value.name,
        UPCCode: this.productForm.value.upcCode,
        price: this.productForm.value.price,
        description: this.productForm.value.description,
        storeId: this.sid,
        images: finalAttachment,
      };
    }
    this.productService.saveProduct(this.productSaveData).then((res) => {
      this.router.navigate([`${URL_ROUTES.STORE_HOME}`]);
    });
  }

  onCancel() {
    this.router.navigate([`${URL_ROUTES.STORE_HOME}`]);
  }

  ngOnDestroy() {
    this.productForm.reset();
  }

  getProductDetailByUpcCode(upcCode) {
    const params = {
      upc: [upcCode],
      isProcess: false,
      sid: this.sid
    };
    this.productService.scanData(params).then((res: any) => {
      if (res.data[0].status) {
        this.setEditForm(res.data[0].data);
      } else {
        this.productForm.controls.upcCode.setValue('');
        this.util.showErrorToast(res.data[0].msg);
      }
    }, err => { });
  }

  convertImageUrl() {
    if (this.type === Constants.SCAN) {
      const imagesArray = this.imageArray;
      this.imageArray = [];
      this.displayImage.map((element, index) => {
        if (element.image.substring(0, 5) === 'https') {
          this.imageArray.push({
            attachment: element.image,
            name: this.productForm.controls.upcCode.value + '_' + index + '.png',
          });
          this.productForm.controls.productImage.setValue(this.imageArray.length > 0 ? true : null);
          this.photoInput.nativeElement.value = '';
        }
      });
      imagesArray.map((element, index) => {
        const idx = index + this.imageArray.length;
        this.imageArray.push({
          attachment: element.attachment,
          name: this.productForm.controls.upcCode.value + '_' + idx + '.png',
        });
      });
      this.saveProduct();
    }
  }
}
