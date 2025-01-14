import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  theKeyword = ''
  previousKeyword = ' '

  thePageNumber: number = 1
  thePageSize : number = 5;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')

    if(this.searchMode){
      this.handleSearchProducts()
    } else {
      this.handleListProducts()
    }
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!
    } else {
      this.currentCategoryId = 1
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId

    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
    .subscribe(this.processResult())
  }

  handleSearchProducts(){
    this.theKeyword = this.route.snapshot.paramMap.get('keyword')!

    if(this.theKeyword != this.previousKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = this.theKeyword;

    this.productService.searchProductsPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.theKeyword)
    .subscribe(this.processResult())
  }

  updatePageSize(newPageSize: string){
    this.thePageSize = +newPageSize
    this.thePageNumber = 1;
    this.listProducts()
  }

  processResult() {
    return (data: any) => {
      this.products = data.content
      this.thePageNumber = data.number + 1
      this.thePageSize = data.size
      this.theTotalElements = data.totalElements
    }
  }
}
