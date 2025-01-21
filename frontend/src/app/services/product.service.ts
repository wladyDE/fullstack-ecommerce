import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api'

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    currentCategoryId: number)
    :Observable<GetResponseProducts>
  {
    const url = `${this.baseUrl}/products/search/findByCategoryId?id=${currentCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(url);
  }

  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string)
    :Observable<GetResponseProducts>
  {
    const url = `${this.baseUrl}/products/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductList(currentCategoryId: number): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search/findByCategoryId?id=${currentCategoryId}`

    return this.getProducts(url);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const url = `${this.baseUrl}/product-category`

    return this.httpClient.get<ProductCategory[]>(url);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search/findByNameContaining?name=${theKeyword}`

    return this.getProducts(url);
  }

  getProduct(theProductId: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${theProductId}`

    return this.httpClient.get<Product>(url)
  }

  getProducts(url: string) {
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response.content)
    );
  }
}

interface GetResponseProducts {
  content: Product[],
  size: number, // size of this page
  totalElements: number, // total of all elements
  totalPages: number, // total pages available
  number: number // current page number
}
