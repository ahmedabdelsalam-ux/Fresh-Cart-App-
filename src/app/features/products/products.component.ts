import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { ProductService } from '../../core/services/products/product.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchByTitelPipe } from '../../shared/pipes/search-by-titel-pipe';
import { Product } from './../../core/models/productsInter/product.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchByTitelPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  AllProductList: WritableSignal<Product[]> = signal<Product[]>([]);

  text: string = '';

  productSearch: string = '';

  pagination: PaginationInstance = {
    id: 'products',
    itemsPerPage: 15,
    currentPage: 1,
    totalItems: 0,
  };

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(): void {
    this.productService
      .getAllPoducts(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.AllProductList.set(res.data);
          this.pagination.totalItems = res.results;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  pageChanged(page: number): void {
    this.pagination.currentPage = page;
    this.getAllProduct();
  }
}
