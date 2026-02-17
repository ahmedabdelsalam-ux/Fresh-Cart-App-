import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CartDataRespons } from '../models/cart-data.interface';
import { CartDetailsRespons } from '../models/cart-details.interface';
import { PaymentdetailsRespons } from '../models/paymentdetails.interface';
import { PaymentdetailscachRespons } from '../models/paymentdetailscach.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  cartCount: WritableSignal<number> = signal<number>(0);

  addProductToCart(id: string): Observable<CartDataRespons> {
    return this.httpClient.post<CartDataRespons>(environment.base_url + 'cart', {
      productId: `${id}`,
    });
  }

  getLogedUserCart(): Observable<CartDetailsRespons> {
    return this.httpClient.get<CartDetailsRespons>(environment.base_url + 'cart');
  }

  removeProductFromCart(id: string): Observable<CartDetailsRespons> {
    return this.httpClient.delete<CartDetailsRespons>(environment.base_url + `cart/${id}`);
  }

  updateCartQuantity(id: string, count: number): Observable<CartDetailsRespons> {
    return this.httpClient.put<CartDetailsRespons>(environment.base_url + `cart/${id}`, {
      count: count,
    });
  }

  removeAllCart(): Observable<any> {
    return this.httpClient.delete<any>(environment.base_url + 'cart');
  }

  // checkOutSessionWithVisa(
  //   cartId: string | null,
  //   checkOutData: object,
  // ): Observable<PaymentdetailsRespons> {
  //   const returnUrl = this.getReturnUrl();

  //   return this.httpClient.post<PaymentdetailsRespons>(
  //     `${environment.base_url}orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
  //     checkOutData,
  //   );
  // }

  checkOutSessionWithCach(
    cartId: string | null,
    checkOutData: object,
  ): Observable<PaymentdetailscachRespons> {
    return this.httpClient.post<PaymentdetailscachRespons>(
      environment.base_url + `orders/${cartId}`,
      checkOutData,
    );
  }

  setOnlineOrder(cartId: string | null, checkOutData: object): Observable<PaymentdetailsRespons> {
    const returnUrl = window.location.origin;
    return this.httpClient.post<PaymentdetailsRespons>(
      `${environment.base_url}orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
      checkOutData,
    );
  }
}
