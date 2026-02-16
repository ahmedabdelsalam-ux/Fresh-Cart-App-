import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { AllordersService } from './services/allorders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { storedKey } from '../../core/constants/stored_Key';
import { CurrencyPipe, DatePipe, isPlatformBrowser, SlicePipe } from '@angular/common';
import { Allorders } from './models/allorders.interface';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe, CurrencyPipe, SlicePipe],

  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly allordersService = inject(AllordersService);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly paltId = inject(PLATFORM_ID);

  orders: WritableSignal<Allorders[]> = signal<Allorders[]>([]);

  userId: string | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.paltId)) {
      const token = localStorage.getItem(storedKey.userToken);
      if (token) {
        this.getUserOrders();
      }
    }
  }

  getUserOrders(): void {
    this.allordersService.getUserOrder().subscribe({
      next: (res) => {
        console.log(res);
        this.orders.set(res);
      },
    });
  }
}
