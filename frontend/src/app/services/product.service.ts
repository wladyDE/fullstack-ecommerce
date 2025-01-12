import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/products'

  constructor(private httpClient: HttpClient) { }

  getProductList(currentCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}?id=${currentCategoryId}`

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response.content)
    );
  }
}

interface GetResponse {
  content : Product[]
}
