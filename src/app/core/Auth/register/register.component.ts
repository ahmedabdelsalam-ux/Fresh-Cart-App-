import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/Authontication/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  errorMessege: WritableSignal<string> = signal('');

  refSubscribtion: Subscription = new Subscription();

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  flagPassword: boolean = true;
  flagRepassword: boolean = true;

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerFormInit();
  }

  registerFormInit(): void {
    this.registerForm = new FormGroup(
      {
        name: new FormControl(null, [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(3),
        ]),

        email: new FormControl(null, [Validators.required, Validators.email]),

        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
        ]),
        rePassword: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
        ]),
        phone: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(?:\+20|0)?1[0125][0-9]{8}$/),
        ]),
      },
      {
        validators: this.handelConfirmPassword,
      },
    );
  }

  handelConfirmPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('rePassword')?.value ? null : { missMatch: true };
  }

  submitRegisterForm() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      // console.log(this.registerForm.value);

      this.refSubscribtion.unsubscribe();

      this.refSubscribtion = this.authService.sendRegisterData(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.isLoading.set(false);
            this.registerForm.reset();
            this.errorMessege.set('');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.isLoading.set(false);
          this.errorMessege.set(err.error.message);
          this.registerForm.reset();
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
      this.showFirstControl();
    }
  }

  showFirstControl() {
    const controls = this.registerForm.controls;

    for (const controlName in controls) {
      const control = controls[controlName];
      if (control.invalid) {
        control.markAsTouched();
        break;
      }
    }
  }

  showPassword(): void {
    this.flagPassword = !this.flagPassword;
  }
  showRepassword(): void {
    this.flagRepassword = !this.flagRepassword;
  }
}
