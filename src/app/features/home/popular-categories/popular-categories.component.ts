import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Categories } from '../../../core/models/categoriesInter/categories.interface';
import { CategoriesService } from './../../../core/services/categories/categories.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule, RouterLink],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css',
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categorieList: WritableSignal<Categories[]> = signal<Categories[]>([]);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categorieList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  categoriesCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
  };
}
