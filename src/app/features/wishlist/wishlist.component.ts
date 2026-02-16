import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  effect,
  WritableSignal,
  signal,
} from '@angular/core';
import { WishlistService } from './services/wishlist.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { storedKey } from '../../core/constants/stored_Key';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CardComponent, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly platId = inject(PLATFORM_ID);
  private readonly toastrService = inject(ToastrService);

  wishListData = this.wishlistService.wishlistData;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
      const token = localStorage.getItem(storedKey.userToken);
      if (token) {
        this.getLogedUserWishlistData();
      }
    }
  }

  getLogedUserWishlistData(): void {
    this.wishlistService.getLogedUserWithList().subscribe({
      next: (res) => {},
      error: (err) => {
        this.toastrService.error('Failed to load wishlist', 'Error');
      },
    });
  }
}
