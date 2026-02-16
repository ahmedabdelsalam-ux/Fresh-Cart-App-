import { Component, computed, inject, Input, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/Auth/services/Authontication/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { storedKey } from '../../../core/constants/stored_Key';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @Input({ required: true }) isLogin!: boolean;

  constructor(private flowbiteService: FlowbiteService) {}

  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  private readonly platId = inject(PLATFORM_ID);

  count: Signal<number> = computed(() => this.cartService.cartCount());

  wishListcount: Signal<number> = computed(() => this.wishlistService.wishlistCount());

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    if (isPlatformBrowser(this.platId)) {
      const token = localStorage.getItem(storedKey.userToken);

      if (token) {
        this.getAllCartData();
        this.getAllWishlistData();
      }
    }
  }

  getAllCartData(): void {
    this.cartService.getLogedUserCart().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      },
    });
  }

  getAllWishlistData(): void {
    this.wishlistService.getLogedUserWithList().subscribe({
      next: (res) => {
        this.wishlistService.wishlistCount.set(res.count || res.data.length);
      },
      error: (err) => {
        console.log('Failed to load wishlist:', err);
      },
    });
  }

  signOut(): void {
    this.authService.userLogOut();
  }
}
