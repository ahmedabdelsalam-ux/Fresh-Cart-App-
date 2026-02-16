import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/Authontication/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-fogetpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './fogetpassword.component.html',
  styleUrl: './fogetpassword.component.css',
})
export class FogetpasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);

  forgetPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.forgetPasswordFormInit();
  }

  forgetPasswordFormInit(): void {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  confirmEmail(): void {
    if (this.forgetPasswordForm.valid) {
      // console.log(this.forgetPasswordForm.value);
      this.authService.forgetPassword(this.forgetPasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
        },
      });
    }
  }
}
