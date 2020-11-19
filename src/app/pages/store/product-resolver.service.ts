import { Injectable } from '@angular/core';
import { ProductService } from '@services/product.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';
import { Constants } from '@constant/constants';

@Injectable()
export class ProductResolverService {

  constructor(private productService: ProductService,
    private localStorage: LocalStorageService) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.productService.getProductsList(this.localStorage.readStorage(Constants.SID), 1);

  }
}
