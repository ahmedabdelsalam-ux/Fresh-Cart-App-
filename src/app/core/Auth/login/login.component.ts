import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/Authontication/auth.service';
import { subscribe } from 'node:diagnostics_channel';
import { subscribeOn, Subscription } from 'rxjs';
import { storedKey } from '../../constants/stored_Key';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);

  refSubscribtion: Subscription = new Subscription();

  private readonly router = inject(Router);

  errorMessege: WritableSignal<string> = signal('');

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  flagPassword: boolean = true;

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginFormInit();
  }

  loginFormInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),

      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
      ]),
    });
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      // console.log(this.loginform.value);

      this.refSubscribtion.unsubscribe();

      this.refSubscribtion = this.authService.sendLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.isLoading.set(false);
            this.loginForm.reset();
            this.errorMessege.set('');
            localStorage.setItem(storedKey.userToken, res.token);
            this.authService.decodeToken();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.isLoading.set(false);
          this.errorMessege.set(err.error.message);
          this.loginForm.reset();
        },
      });
    }
  }

  showPassword(): void {
    this.flagPassword = !this.flagPassword;
  }
}
