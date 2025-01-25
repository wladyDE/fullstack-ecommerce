import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.luv2shopApiUrl + '/orders'

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${email}`

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl)
  }
}

interface GetResponseOrderHistory {
  content: OrderHistory[],
  size: number, // size of this page
  totalElements: number, // total of all elements
  totalPages: number, // total pages available
  number: number // current page number
}
