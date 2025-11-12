import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <nav class="mb-6" style="display:flex; gap:12px; flex-wrap:wrap">
      <a mat-raised-button color="primary" routerLink="/login">Login</a>
      <a mat-raised-button color="accent" routerLink="/shop/products">Products</a>
      <a mat-raised-button color="warn" routerLink="/shop/rating">Products Rating</a>
    </nav>
    <section class="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 class="text-3xl font-bold tracking-tight text-blue-600">Bienvenue sur My Shop</h1>
      <p class="text-gray-600">Choisis une zone :</p>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          routerLink="/dev"
          class="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring"
        >
          Zone de test MSW
        </button>
        <button
          type="button"
          routerLink="/app"
          class="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring"
        >
          Accéder à l’app (placeholder)
        </button>
      </div>
    </section>
  `,
})
export class HomeComponent {
  protected readonly title = signal('my-shop');
}
