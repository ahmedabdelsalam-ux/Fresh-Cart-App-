import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { CartService } from './services/cart.service';
import { CartDetails } from './models/cart-details.interface';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { storedKey } from '../../core/constants/stored_Key';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly platId = inject(PLATFORM_ID);

  cartDetailsData: WritableSignal<CartDetails> = signal<CartDetails>({} as CartDetails);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
      const token = localStorage.getItem(storedKey.userToken);

      if (token) {
        this.getLogedUserCartData();
      }
    }
  }

  getLogedUserCartData(): void {
    this.cartService.getLogedUserCart().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data);
        }
      },
    });
  }

  removeItmeFromCart(id: string): void {
    this.cartService.removeProductFromCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.cartCount.set(res.numOfCartItems);
          this.getLogedUserCartData();
          // this.cartDetailsData.set(res.data);
        }
      },
    });
  }

  updateProductCount(id: string, count: number): void {
    this.cartService.updateCartQuantity(id, count).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.cartCount.set(res.numOfCartItems);

          this.getLogedUserCartData();
          // this.cartDetailsData.set(res.data);
        }
      },
    });
  }

  clearAllProductFromCart() {
    this.cartService.removeAllCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.getLogedUserCartData();
          this.cartService.cartCount.set(0);
          // this.cartDetailsData.set(res.data);
        }
      },
    });
  }
}
