// external
import { Component, OnInit } from '@angular/core';

// internal
import { ProductService } from '@services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants, URL_ROUTES } from '@constant/constants';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  public productId: any;
  public productDetails: any;
  title = 'productDetail.title';
  reviewList: any[] = [];
  reviewCount: any;
  constructor(private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.getProductDetails(this.productId);
    const categoryID = this.localStorage.readStorage(Constants.CATEGORYID);
    if (+categoryID === 4) {
      this.title = 'restaurantDetail.title';
    }
  }

  getProductDetails(id) {
    this.productService.getProductsDetails(id).then((res: any) => {
      this.productDetails = res;
      this.reviewCount = res.review.length;
      this.reviewList = res.review.filter((x, i) => i < 3);
    });
  }
  onSeeAll(item) {
    this.router.navigate([`${URL_ROUTES.PRODUCT_REVIEW}`], {
      queryParams: { id: item.product.pId },
    });
  }
}
