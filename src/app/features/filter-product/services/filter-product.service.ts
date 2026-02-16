import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterProductRespons } from '../models/filter-product.interface';

@Injectable({
  providedIn: 'root',
})
export class FilterProductService {
  private readonly httpClient = inject(HttpClient);

  filterProductByCategory(id: string | null): Observable<FilterProductRespons> {
    return this.httpClient.get<FilterProductRespons>(
      `https://ecommerce.routemisr.com/api/v1/products?category=${id}`,
    );
  }
}
