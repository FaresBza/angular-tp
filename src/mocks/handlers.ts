/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products, userProfile, ordersDetails } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

type Review = {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const reviewsDb: Record<string, Review[]> = {};

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({
        ...p,
        stock: (p as any).stock ?? (5 + (p.id % 6) * 3),
        _avg: avgRating(p.ratings),
      }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // GET /api/products/:id/reviews/ -> Review[]
  http.get(`${API}/products/:id/reviews/`, async ({ params }) => {
    const productId = String(params['id']);

    // Vérifie que le produit existe (optionnel mais propre)
    const exists = products.some((p) => String(p.id) === productId);
    if (!exists) {
      return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return HttpResponse.json(reviewsDb[productId] ?? [], { status: 200 });
  }),

  // POST /api/products/:id/reviews/ -> Review
  http.post(`${API}/products/:id/reviews/`, async ({ params, request }) => {
    const productId = String(params['id']);

    const exists = products.some((p) => String(p.id) === productId);
    if (!exists) {
      return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { rating: number; comment: string };

    const rating = Math.max(1, Math.min(5, Number(body.rating)));
    const comment = String(body.comment ?? '').trim();

    if (!comment || comment.length < 5) {
      return HttpResponse.json(
        { detail: 'Comment must be at least 5 characters.' },
        { status: 400 },
      );
    }

    const review: Review = {
      id: `REV-${Date.now()}`,
      productId,
      user: userProfile.username ?? 'demo-user',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    reviewsDb[productId] = [...(reviewsDb[productId] ?? []), review];

    return HttpResponse.json(review, { status: 201 });
  }),

  // --- User profile: GET /api/me/ ---
  http.get(`${API}/me/`, async () => {
    return HttpResponse.json(userProfile, { status: 200 });
  }),

  // --- User profile: PATCH /api/me/ ---
  http.patch(`${API}/me/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const prefs = body.preferences ?? {};

    userProfile.preferences = {
      ...userProfile.preferences,
      ...prefs,
    };

    return HttpResponse.json(userProfile, { status: 200 });
  }),

  // --- Orders summary: GET /api/me/orders/ ---
  http.get(`${API}/me/orders/`, async () => {
    return HttpResponse.json(userProfile.orders, { status: 200 });
  }),

  // --- Order detail: GET /api/orders/:id/ ---
  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const id = params['id'] as string;
    const order = ordersDetails[id];

    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }

    return HttpResponse.json(order, { status: 200 });
  }),
];
