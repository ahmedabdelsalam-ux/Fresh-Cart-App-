import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductDetailsService } from '../../core/services/products/services/product-details/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from '../../core/models/productsInter/product-detailsInter/product-details.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly productDetailsService = inject(ProductDetailsService);

  private readonly activatedRoute = inject(ActivatedRoute);
  productId: string | null = null;

  productDetailsData: WritableSignal<ProductDetails> = signal<ProductDetails>({} as ProductDetails);

  ngOnInit(): void {
    this.getproductId();
    this.getProductDetails();
  }

  getproductId() {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParms) => {
        this.productId = urlParms.get('id');
      },
    });
  }

  getProductDetails(): void {
    this.productDetailsService.getOneProduct(this.productId).subscribe({
      next: (res) => {
        this.productDetailsData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  activeIndex = 0;
  private touchStartX = 0;
  private touchEndX = 0;

  get totalSlides(): number {
    return (this.productDetailsData().images?.length ?? 0) + 1;
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.totalSlides;
  }

  prevSlide(): void {
    this.activeIndex = (this.activeIndex - 1 + this.totalSlides) % this.totalSlides;
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].screenX;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? this.nextSlide() : this.prevSlide();
    }
  }
}
