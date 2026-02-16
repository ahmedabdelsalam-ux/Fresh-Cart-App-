import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { productRespons } from '../../models/productsInter/product.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  getAllPoducts(page: number = 1, limit: number = 10): Observable<productRespons> {
    return this.httpClient.get<productRespons>(
      environment.base_url + `products?page=${page}&limit=${limit}`,
    );
  }
}
