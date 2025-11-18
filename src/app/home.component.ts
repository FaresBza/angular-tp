import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.component.css',
  template: `
    <section class="home-section">
      <h1 class="home-title">Bienvenue sur My Shop</h1>
      <p class="home-subtitle">Choisis une zone :</p>

      <div class="home-buttons">
        <button
          type="button"
          routerLink="/dev"
          class="btn btn-amber"
        >
          Zone de test MSW
        </button>
        <button
          type="button"
          routerLink="/app"
          class="btn btn-emerald"
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
