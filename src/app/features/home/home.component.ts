import { Component } from '@angular/core';
import { PopularProductComponent } from './popular-product/popular-product.component';
import { PopularCategoriesComponent } from './popular-categories/popular-categories.component';
import { MainSliderComponent } from './main-slider/main-slider.component';

@Component({
  selector: 'app-home',
  imports: [PopularProductComponent, PopularCategoriesComponent, MainSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
