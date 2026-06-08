import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { FilterProduct } from './models/filter-product.interface';
import { FilterProductService } from './services/filter-product.service';

@Component({
  selector: 'app-filter-product',
  imports: [CardComponent, RouterLink],
  templateUrl: './filter-product.component.html',
  styleUrl: './filter-product.component.css',
})
export class FilterProductComponent implements OnInit {
  private readonly filterProductService = inject(FilterProductService);
  categorytId: string | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);
  categoryName: string = '';

  FilterProducts: WritableSignal<FilterProduct[]> = signal<FilterProduct[]>([]);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((urlParams) => {
      this.categorytId = urlParams.get('id');
      this.getFilterProducts();
    });
  }

  getCategoryId() {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParms) => {
        this.categorytId = urlParms.get('id');
      },
    });
  }

  getFilterProducts() {
    this.filterProductService.filterProductByCategory(this.categorytId).subscribe({
      next: (res) => {
        this.FilterProducts.set(res.data);
        // الاسم بييجي من أول product في الـ response
        if (res.data.length > 0) {
          this.categoryName = res.data[0].category.name;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
