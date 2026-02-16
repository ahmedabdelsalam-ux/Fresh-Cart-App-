import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DecodeToken } from '../../../core/Auth/models/users/decode-token.interface';
import { storedKey } from '../../../core/constants/stored_Key';
import { AllordersRespons } from '../models/allorders.interface';

@Injectable({
  providedIn: 'root',
})
export class AllordersService {
  private readonly httpClient = inject(HttpClient);

  usreDataDecoded: DecodeToken = {} as DecodeToken;

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem(storedKey.userToken);

    if (!token) return null;

    const decoded = jwtDecode<DecodeToken>(token);

    return decoded.id;
  }

  getUserOrder(): Observable<AllordersRespons> {
    const userId = this.getUserIdFromToken();
    return this.httpClient.get<AllordersRespons>(environment.base_url + `orders/user/${userId}`);
  }
}
