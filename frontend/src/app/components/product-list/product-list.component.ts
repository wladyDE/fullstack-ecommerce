import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = []

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.listProducts()
  }

  listProducts() {
    this.productService.getProductList().subscribe(
      data => {
        this.products = data
        console.log(data);

      }
    )
  }
}
