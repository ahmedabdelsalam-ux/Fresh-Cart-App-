import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { WishList } from '../models/wish-list.interface';
import { WishListDataRespons, WishListData } from '../models/wish-list-data.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  // State Management
  wishlistIds: WritableSignal<Set<string>> = signal(new Set<string>());
  wishlistCount: WritableSignal<number> = signal(0);
  wishlistData: WritableSignal<WishListData[]> = signal<WishListData[]>([]);

  addProductToWishList(id: string): Observable<WishList> {
    return this.httpClient
      .post<WishList>(environment.base_url + 'wishlist', {
        productId: `${id}`,
      })
      .pipe(
        tap((res) => {
          if (res.status === 'success') {
            const currentIds = new Set(this.wishlistIds());
            currentIds.add(id);
            this.wishlistIds.set(currentIds);
            this.wishlistCount.set(res.data?.length || this.wishlistCount() + 1);
          }
        }),
      );
  }

  getLogedUserWithList(): Observable<WishListDataRespons> {
    return this.httpClient.get<WishListDataRespons>(environment.base_url + 'wishlist').pipe(
      tap((res) => {
        if (res.status === 'success') {
          const ids = new Set(res.data.map((item) => item._id));
          this.wishlistIds.set(ids);
          this.wishlistCount.set(res.count || res.data.length);
          this.wishlistData.set(res.data);
        }
      }),
    );
  }

  removeProductFromWishList(id: string): Observable<WishList> {
    return this.httpClient.delete<WishList>(environment.base_url + `wishlist/${id}`).pipe(
      tap((res) => {
        if (res.status === 'success') {
          const currentIds = new Set(this.wishlistIds());
          currentIds.delete(id);
          this.wishlistIds.set(currentIds);

          this.wishlistCount.set(res.data?.length || this.wishlistCount() - 1);

          const currentData = this.wishlistData();
          const updatedData = currentData.filter((item) => item._id !== id);
          this.wishlistData.set(updatedData);
        }
      }),
    );
  }

  isInWishlist(id: string): boolean {
    return this.wishlistIds().has(id);
  }

  toggleWishlist(id: string): Observable<WishList> {
    if (this.isInWishlist(id)) {
      return this.removeProductFromWishList(id);
    } else {
      return this.addProductToWishList(id);
    }
  }
}
