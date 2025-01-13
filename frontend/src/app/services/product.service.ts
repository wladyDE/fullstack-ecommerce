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
    const searchUrl = `${this.baseUrl}/products?id=${currentCategoryId}`

    return this.httpClient.get<{content : Product[]}>(searchUrl).pipe(
      map(response => response.content)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = `${this.baseUrl}/product-category`

    return this.httpClient.get<ProductCategory[]>(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search?name=${theKeyword}`

    return this.httpClient.get<{content : Product[]}>(searchUrl).pipe(
      map(response => response.content)
    );
  }
}
