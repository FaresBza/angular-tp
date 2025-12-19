# E4 - Application e-commerce Angular + NgRx

## Sommaire

- [Routes & fonctionnalités](#routes--fonctionnalités)
- [Architecture & structure](#architecture--structure)
- [NgRx slices](#ngrx-slices)
- [Décisions techniques](#décisions-techniques)
- [Code Quality](#code-quality)
- [Lancer le projet](#lancer-le-projet)

---

## Routes & fonctionnalités

### `/shop/products`
- Liste des produits (Material table) + pagination
- Filtres : `minRating`, `ordering`
- Wishlist toggle par produit (icône)
- Accès panier (badge count)
- Navigation vers `/shop/details/:id` via clic ligne ou clavier (Enter/Espace)

---

### `/shop/details/:id` (Product details + reviews)
- Affichage du produit avec ses informations.
- Ajout panier + redirection `/shop/products` + notification succès
- Wishlist toggle
- Reviews :
  - chargement liste
  - création review (rating + comment)
  - recalcul moyenne + count via selectors

---

### `/shop/cart`
- Liste des produits dans le panier
- Quantités (update) + suppression
- Gestion coupon/promo
- Calcul des totaux (subtotal, discount, taxes, delivery, total) via selectors

---

### `/shop/checkout`
- Stepper / formulaire
- Validation finale commande
- Ajout commande au state utilisateur
- Notification succès

- Guard : interdiction d’accéder à `/shop/checkout` si panier vide (redirige vers `/shop/cart` + toast erreur)

---

### `/account/profile`
- Page profil utilisateur (name, email, address)

### `/account/orders`
- Liste des commandes passées

### `/account/orders/:id`
- Détails d’une commande : items, prix, taxes, totals, shipping address

### `/shop/wishlist`
- Liste des produits wishlisted (basée sur IDs)
- Toggle remove

---

## Architecture & structure

```
├── .github
│   └── workflows
│       └── ci.yml
├── public
│   ├── favicon.ico
│   └── mockServiceWorker.js
├── src
│   ├── app
│   │   ├── account
│   │   │   ├── order-details
│   │   │   │   ├── order-details.css
│   │   │   │   ├── order-details.html
│   │   │   │   ├── order-details.spec.ts
│   │   │   │   └── order-details.ts
│   │   │   ├── orders
│   │   │   │   ├── orders.css
│   │   │   │   ├── orders.html
│   │   │   │   ├── orders.spec.ts
│   │   │   │   └── orders.ts
│   │   │   └── profile
│   │   │       ├── profile.css
│   │   │       ├── profile.html
│   │   │       ├── profile.spec.ts
│   │   │       └── profile.ts
│   │   ├── admin
│   │   │   ├── admin.css
│   │   │   ├── admin.html
│   │   │   ├── admin.spec.ts
│   │   │   └── admin.ts
│   │   ├── cart
│   │   │   ├── cart.css
│   │   │   ├── cart.html
│   │   │   ├── cart.spec.ts
│   │   │   └── cart.ts
│   │   ├── checkout
│   │   │   ├── checkout.css
│   │   │   ├── checkout.html
│   │   │   ├── checkout.spec.ts
│   │   │   └── checkout.ts
│   │   ├── dev
│   │   │   ├── dev-auth.component.ts
│   │   │   ├── dev-index.component.ts
│   │   │   ├── dev-product-rating.component.ts
│   │   │   └── dev-products.component.ts
│   │   ├── layout
│   │   │   └── side-nav
│   │   │       ├── side-nav.css
│   │   │       ├── side-nav.html
│   │   │       ├── side-nav.spec.ts
│   │   │       └── side-nav.ts
│   │   ├── login
│   │   │   ├── login.css
│   │   │   ├── login.html
│   │   │   ├── login.spec.ts
│   │   │   └── login.ts
│   │   ├── product-details
│   │   │   ├── product-details.css
│   │   │   ├── product-details.html
│   │   │   ├── product-details.spec.ts
│   │   │   └── product-details.ts
│   │   ├── products
│   │   │   ├── products.css
│   │   │   ├── products.html
│   │   │   ├── products.spec.ts
│   │   │   └── products.ts
│   │   ├── state
│   │   │   ├── admin
│   │   │   │   ├── admin.actions.ts
│   │   │   │   ├── admin.effects.ts
│   │   │   │   ├── admin.guard.ts
│   │   │   │   ├── admin.models.ts
│   │   │   │   ├── admin.reducer.ts
│   │   │   │   └── admin.selectors.ts
│   │   │   ├── auth
│   │   │   │   ├── auth.actions.ts
│   │   │   │   ├── auth.effects.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── auth.reducer.ts
│   │   │   │   └── auth.selectors.ts
│   │   │   ├── cart
│   │   │   │   ├── cart.actions.ts
│   │   │   │   ├── cart.effects.ts
│   │   │   │   ├── cart.reducer.ts
│   │   │   │   ├── cart.selectors.ts
│   │   │   │   └── checkout.guard.ts
│   │   │   ├── products
│   │   │   │   ├── products.action.ts
│   │   │   │   ├── products.effects.ts
│   │   │   │   ├── products.reducer.ts
│   │   │   │   └── products.selectors.ts
│   │   │   ├── reviews
│   │   │   │   ├── reviews.actions.ts
│   │   │   │   ├── reviews.effects.ts
│   │   │   │   ├── reviews.models.ts
│   │   │   │   ├── reviews.reducer.ts
│   │   │   │   └── reviews.selectors.ts
│   │   │   ├── tests
│   │   │   │   ├── auth.effects.spec.ts
│   │   │   │   ├── auth.reducer.spec.ts
│   │   │   │   ├── cart.reducer.spec.ts
│   │   │   │   ├── products.effect.spec.ts
│   │   │   │   └── user.selectors.spec.ts
│   │   │   ├── ui
│   │   │   │   ├── ui.actions.ts
│   │   │   │   ├── ui.effects.ts
│   │   │   │   ├── ui.models.ts
│   │   │   │   ├── ui.reducer.ts
│   │   │   │   └── ui.selectors.ts
│   │   │   └── user
│   │   │       ├── user.actions.ts
│   │   │       ├── user.effects.ts
│   │   │       ├── user.models.ts
│   │   │       ├── user.reducer.ts
│   │   │       └── user.selectors.ts
│   │   ├── ui
│   │   │   └── skeletons
│   │   │       └── table-skeletons
│   │   │           └── table-skeleton
│   │   │               ├── table-skeleton.css
│   │   │               ├── table-skeleton.html
│   │   │               ├── table-skeleton.spec.ts
│   │   │               └── table-skeleton.ts
│   │   ├── wishlist
│   │   │   ├── wishlist.css
│   │   │   ├── wishlist.html
│   │   │   ├── wishlist.spec.ts
│   │   │   └── wishlist.ts
│   │   ├── app-placeholder.component.ts
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.spec.ts
│   │   ├── app.ts
│   │   ├── home.component.css
│   │   └── home.component.ts
│   ├── mocks
│   │   ├── browser.ts
│   │   ├── data.ts
│   │   ├── handlers.ts
│   │   └── utils.ts
│   ├── custom-theme.scss
│   ├── index.html
│   ├── main.ts
│   └── styles.css
└── README.md
```

---

## NgRx slices

### `products`
- state : list, count, loading, error, lastRating
- effects : fetch produits, fetch rating API

### `reviews`
- state : byProductId, loading, error
- selectors : reviewsByProductId, avg/count dérivés

### `cart`
- state : items, coupon, delivery, message
- selectors : subtotal, discount, taxes, total

### `user`
- state : profile, orders, wishlistProductIds
- wishlist persistée localStorage

### `ui`
- state : loading flags + queue de toasts
- effects : affichage global notifications

---

## Décisions techniques

### Wishlist
- Stockée dans `user.wishlistProductIds: string[]`
- Persistée `localStorage`
- Avantage : léger, pas de duplication objets produits

### Calculs
- Totaux panier + stats reviews calculées via selectors (source de vérité unique).
- Permet testabilité + perf (memoization).

### UX
- Notifications globales via slice `ui` (succès/erreurs).
- Skeleton loaders sur pages critiques.

---

## Code Quality

### Global Notifications
Notifications globales (NgRx → Effects) :
- success : add to cart, order validated, review created, wishlist toggle
- error : API failure, invalid promo, insufficient stock, checkout forbidden (cart empty)

### Loaders & Skeletons
- `/shop/products` : table skeleton
- `/shop/details/:id` : loaders rating/reviews (spinner / states)
- `/shop/checkout` : loader critique lors de la validation

### Tests unitaires
- Reducers : `cart.reducer.spec.ts`, `auth.reducer.spec.ts`
- Selectors : `user.selectors.spec.ts`
- Effects : `products.effects.spec.ts`, `auth.effects.spec.ts`
- Components : 
    - `order-details.spec.ts`, 
    - `orders.spec.ts`
    - `admin.spec.ts`, 
    - `cart.spec.ts`
    - `checkout.spec.ts`
    - `login.spec.ts`, 
    - `product-details.spec.ts`, 
    - `products.spec.ts`
    - `table-skeletons.spec.ts`, 
    - `wislist.spec.ts`

### CI (GitHub Actions)
Workflow exécuté sur chaque PR vers `main` :
- install
- lint
- test
- build

---

## Lancer le projet

```bash
npm install
npm start