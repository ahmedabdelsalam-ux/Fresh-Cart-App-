import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../core/services/products/product.service';
import { Product } from '../../../core/models/productsInter/product.interface';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-popular-product',
  imports: [CardComponent],
  templateUrl: './popular-product.component.html',
  styleUrl: './popular-product.component.css',
})
export class PopularProductComponent implements OnInit {
  private readonly productService = inject(ProductService);

  productList: WritableSignal<Product[]> = signal<Product[]>([]);

  ngOnInit(): void {
    this.getPopulartProduct();
  }

  getPopulartProduct(): void {
    this.productService.getAllPoducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
