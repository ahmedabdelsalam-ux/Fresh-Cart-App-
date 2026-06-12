import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';
import { ProductDetailsRespons } from '../../../../models/productsInter/product-detailsInter/product-details.interface';
import { CartService } from '../../../../../features/cart/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  private readonly httpClient = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  getOneProduct(id: string | null): Observable<ProductDetailsRespons> {
    return this.httpClient.get<ProductDetailsRespons>(environment.base_url + `products/${id}`);
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
}
