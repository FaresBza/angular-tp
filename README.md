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
src/app/
    products/
    product-details/
    cart/
    checkout/
    wishlist/
    account/ (profile, orders, order-details)
    state/
    auth/
    products/
    reviews/
    cart/
    user/
    ui/ # loaders + notifications
    ui/
    skeletons/
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