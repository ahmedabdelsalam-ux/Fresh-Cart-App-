import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProductDetailsService } from '../../core/services/products/services/product-details/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from '../../core/models/productsInter/product-detailsInter/product-details.interface';
import { WishlistService } from '../wishlist/services/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
import { storedKey } from '../../core/constants/stored_Key';
import { Product } from '../cart/models/cart-data.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  @Input() cardProduct!: Product;
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastrService = inject(ToastrService);
  private readonly platId = inject(PLATFORM_ID);
  productId: string | null = null;

  productDetailsData: WritableSignal<ProductDetails> = signal<ProductDetails>({} as ProductDetails);

  isInWishlist: Signal<boolean> = computed(() => {
    return this.wishlistService.isInWishlist(
      this.productDetailsData()?._id || this.cardProduct?._id || '',
    );
  });

  isProcessing = false;

  ngOnInit(): void {
    this.getproductId();
    this.getProductDetails();

    if (isPlatformBrowser(this.platId)) {
      const token = localStorage.getItem(storedKey.userToken);

      if (token && this.wishlistService.wishlistIds().size === 0) {
        this.wishlistService.getLogedUserWithList().subscribe({
          error: (err) => {
            console.log('Wishlist not loaded:', err);
          },
        });
      }
    }
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

  addProductItemToCart(id: string): void {
    this.productDetailsService.addProductItemToCart(id);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isProcessing) return;

    this.isProcessing = true;
    const id = this.productDetailsData()?._id || this.cardProduct?._id;
    if (!id) return;

    this.wishlistService.toggleWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'Freach Cart');
        }
        this.isProcessing = false;
      },
      error: (err) => {
        this.toastrService.error('Failed to update wishlist', 'Error');
        this.isProcessing = false;
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
