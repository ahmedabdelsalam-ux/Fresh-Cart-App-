import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IBrands } from './models/ibrands.interface';
import { BrandsService } from './services/brands.service';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  allBrands: WritableSignal<IBrands[]> = signal<IBrands[]>([]);

  ngOnInit(): void {
    this.getAllBrandsData();
  }

  getAllBrandsData() {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.allBrands.set(res.data);
      },
    });
  }
}
