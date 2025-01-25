import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = []
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory()
  }

  handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail')!)

    this.orderHistoryService.getOrderHistory(email).subscribe(
      data => {
        this.orderHistoryList = data.content
      }
    )
  }
}
