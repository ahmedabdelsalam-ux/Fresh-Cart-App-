import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IBrandsRespose } from '../models/ibrands.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(): Observable<IBrandsRespose> {
    return this.httpClient.get<IBrandsRespose>(environment.base_url + 'brands');
  }
}
