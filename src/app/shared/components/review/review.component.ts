import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@services/product.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() review: any;
  reviewList: any[] = [];
  productId: any;
  p = 1;

  constructor(private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.productId = params.id;
    });
    if (!!this.productId) {
      this.review = '';
      this.productService.getProductReview(this.productId).then(res => {
        if (res) {
          this.reviewList = res['review'];
        }
      }, err => { });
    }
  }
}
