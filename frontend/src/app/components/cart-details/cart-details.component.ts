import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = []
  totalPrice: number = 0
  totalQuantity: number = 0

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.listCartDetails()
  }

  listCartDetails(){
    this.cartItems = this.cartService.cartItems

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    this.cartService.computeCartTotals()
  }

  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem)
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem)
  }
}
