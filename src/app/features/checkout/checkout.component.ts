import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/services/cart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  private readonly platId = inject(PLATFORM_ID);

  cartId: string | null = null;

  checkOutForm!: FormGroup;

  ngOnInit(): void {
    this.checkOutFormInit();
    this.getCartId();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (urlparms) => {
        this.cartId = urlparms.get('id');
      },
    });
  }

  //   checkOutFormInit(): void {
  //   this.checkOutForm = new FormGroup({
  //     email: new FormControl(null, [Validators.required, Validators.email]),

  //     password: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
  //     ]),
  //   });
  // }

  checkOutFormInit(): void {
    this.checkOutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [null, [Validators.pattern(/^(?:\+20|0)?1[0125][0-9]{8}$/), Validators.required]],
        city: [null, [Validators.required]],
      }),
    });
  }

  onSubmitCheckOutFormWithVisa(): void {
    if (this.checkOutForm.valid) {
      this.cartService.setOnlineOrder(this.cartId, this.checkOutForm.value).subscribe({
        next: (res) => {
          console.log(res);

          if (isPlatformBrowser(this.platId)) {
            if (res.status === 'success' && res.session?.url) {
              window.open(res.session.url, '_self');
            }
          }
        },
      });
    }
  }
  onSubmitCheckOutFormWithCach(): void {
    if (this.checkOutForm.valid) {
      this.cartService.checkOutSessionWithCach(this.cartId, this.checkOutForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.toastrService.success(res.status);
            this.checkOutForm.reset();
            this.router.navigate(['/allorders']);
            this.cartService.cartCount.set(0);
          }
        },
      });
    }
  }
}
