import { ApiService } from './api.service';
import { API } from '@routes/api-routes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) { }

  getProductsList(sid, currentPage) {
    return this.apiService.get(
      `${API.PRODUCT_ROUTES.products}` +
      sid +
      `${API.PRODUCT_ROUTES.productList}` +
      currentPage,
      true,
      true,
    );
  }

  deleteProduct(pId) {
    return this.apiService.delete(
      `${API.PRODUCT_ROUTES.deleteProduct}` + pId,
      true,
    );
  }

  enableProduct(params) {
    return this.apiService.post(
      `${API.PRODUCT_ROUTES.enableProduct}`,
      params,
      true,
    );
  }

  getProductsDetails(id) {
    return this.apiService.get(
      `${API.PRODUCT_ROUTES.editProduct}` + id,
      true,
      true,
    );
  }

  saveProduct(params) {
    const path = params.pId
      ? `${API.PRODUCT_ROUTES.saveProduct}/` + params.pId
      : `${API.PRODUCT_ROUTES.saveProduct}`;
    return this.apiService.post(path, params, true);
  }

  upload(data) {
    return this.apiService.uploadImageWithProgress(
      `${API.IMAGE_UPLOAD.uploadImage}`,
      data,
    );
  }

  uploadCSV(params, sid) {
    return this.apiService.post(
      `${API.PRODUCT_ROUTES.uploadCSV}` + sid,
      params,
      true,
    );
  }

  scanData(params) {
    return this.apiService.post(
      `${API.PRODUCT_ROUTES.scanProduct}`,
      params,
      true,
    );
  }

  getImage(url) {
    return this.apiService.getFile(url);
  }

  getProductReview(id) {
    return this.apiService.get(
      `${API.PRODUCT_ROUTES.editProduct}` + id + `${API.PRODUCT_ROUTES.productReview}`,
      true,
      true,
    );
  }
}
