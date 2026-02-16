import { DecodeToken } from './../../models/users/decode-token.interface';
import { storedKey } from './../../../constants/stored_Key';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { forgetpassword, UserData, UserDataRespons } from '../../models/users/user-data.interface';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly router = inject(Router);

  usreDataDecoded: DecodeToken = {} as DecodeToken;

  sendRegisterData(userData: UserData): Observable<UserDataRespons> {
    return this.httpClient.post<UserDataRespons>(environment.base_url + 'auth/signup', userData);
  }
  sendLoginData(userData: UserData): Observable<UserDataRespons> {
    return this.httpClient.post<UserDataRespons>(environment.base_url + 'auth/signin', userData);
  }

  decodeToken(): void {
    if (localStorage.getItem(storedKey.userToken)) {
      const token = localStorage.getItem(storedKey.userToken)!;
      this.usreDataDecoded = jwtDecode(token);

      console.log(this.usreDataDecoded);
    }
  }

  userLogOut(): void {
    localStorage.removeItem(storedKey.userToken);

    this.router.navigate(['/login']);
  }

  forgetPassword(data: forgetpassword): Observable<UserDataRespons> {
    return this.httpClient.post<UserDataRespons>(
      environment.base_url + 'auth/forgotPasswords',
      data,
    );
  }

  // verifyResetCode(data: forgetpassword): Observable<UserDataRespons> {
  //   return this.httpClient.post<UserDataRespons>(
  //     environment.base_url + 'auth/verifyResetCode',
  //     data,
  //   );
  // }
}
