import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.scss'
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories: ProductCategory[] = []

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.listProductCategories()
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.productCategories = data
      }
    )
  }
}
