import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  Signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../core/models/productsInter/product.interface';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
import { storedKey } from '../../../core/constants/stored_Key';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  @Input() cardProduct!: Product;

  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
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

  addProductItemToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.cartCount.set(res.numOfCartItems);
          //toster
          this.toastrService.success(res.message, 'Freach Cart');
        }
      },
    });
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
