import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [RouterLink],
  styleUrl: './app.css',
  template: `
    <section class="app-placeholder-section">
      <h2 class="app-title">App Shop — Placeholder</h2>
      <p class="app-description">
        Ici viendra l’UI cohérente (login, liste produits, avis...).
      </p>
      <nav class="app-nav">
        <button type="button" routerLink="/dev" class="nav-btn">
          → Aller à la zone de tests
        </button>
        <button type="button" routerLink="/" class="nav-btn">
          ← Retour accueil
        </button>
        <button mat-raised-button routerLink="/login" class="nav-btn">
          Login
        </button>
      </nav>
    </section>

  `,
})
export class AppPlaceholderComponent {}
