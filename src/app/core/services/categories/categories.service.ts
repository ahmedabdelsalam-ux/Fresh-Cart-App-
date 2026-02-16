import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { categoriesRespons } from '../../models/categoriesInter/categories.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getCategories(): Observable<categoriesRespons> {
    return this.httpClient.get<categoriesRespons>(environment.base_url + 'Categories');
  }
}
