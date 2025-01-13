import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080'

  constructor(private httpClient: HttpClient) { }

  getProductList(currentCategoryId: number): Observable<Product[]> {
    const url = `${this.baseUrl}/products?id=${currentCategoryId}`

    return this.getProducts(url);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const url = `${this.baseUrl}/product-category`

    return this.httpClient.get<ProductCategory[]>(url);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search?name=${theKeyword}`

    return this.getProducts(url);
  }

  getProduct(theProductId: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${theProductId}`

    return this.httpClient.get<Product>(url)
  }

  getProducts(url: string){
    return this.httpClient.get<{content : Product[]}>(url).pipe(
      map(response => response.content)
    );
  }
}
