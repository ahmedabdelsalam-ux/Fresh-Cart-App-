import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnInit,
  PLATFORM_ID,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { storedKey } from '../../../core/constants/stored_Key';
import { Product } from '../../../core/models/productsInter/product.interface';
import { ProductDetailsService } from '../../../core/services/products/services/product-details/product-details.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() cardProduct!: Product;

  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platId = inject(PLATFORM_ID);

  isInWishlist: Signal<boolean> = computed(() => {
    return this.wishlistService.isInWishlist(this.cardProduct?._id || '');
  });

  isProcessing = false;

  ngOnInit(): void {
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

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platId)) return; // مش هيشتغل على السيرفر

    this.ngZone.runOutsideAngular(async () => {
      const gsap = (await import('gsap')).gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(this.el.nativeElement, {
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      });
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
    const id = this.cardProduct._id;

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
}
