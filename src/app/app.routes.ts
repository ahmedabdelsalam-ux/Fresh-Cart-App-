import { Routes } from '@angular/router';
import { authGuardsGuard } from './core/guards/auth-guards-guard';
import { gestGuard } from './core/guards/gest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    title: 'Home',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    canActivate: [gestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./core/Auth/login/login.component').then((m) => m.LoginComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./core/Auth/register/register.component').then((m) => m.RegisterComponent),
        title: 'Register',
      },
      {
        path: 'forgetpassword',
        loadComponent: () =>
          import('./core/Auth/fogetpassword/fogetpassword.component').then(
            (m) => m.FogetpasswordComponent,
          ),
        title: 'Forget Password',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuardsGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Home',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products.component').then((m) => m.ProductsComponent),
        title: 'Products',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
        title: 'Categories',
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/brands/brands.component').then((m) => m.BrandsComponent),
        title: 'Brands',
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
        title: 'Cart',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
        title: 'Wish List',
      },
      {
        path: 'checkout/:id',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
        title: 'Checkout',
      },
      {
        path: 'allorders',
        loadComponent: () =>
          import('./features/allorders/allorders.component').then((m) => m.AllordersComponent),
        title: 'orders',
      },
      {
        path: 'details/:slug/:id',
        loadComponent: () =>
          import('./features/details/details.component').then((m) => m.DetailsComponent),
        title: 'Details',
      },
      {
        path: 'filter-product/:slug/:id',
        loadComponent: () =>
          import('./features/filter-product/filter-product.component').then(
            (m) => m.FilterProductComponent,
          ),
        title: 'Filter Product',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/notfound/notfound.component').then((m) => m.NotfoundComponent),
        title: 'Error',
      },
    ],
  },
];
