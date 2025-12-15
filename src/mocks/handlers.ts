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

  // GET /api/admin/summary/
  http.get(`${API}/admin/summary/`, async () => {
    const orderIds = (userProfile.orders ?? []).map((o: any) => String(o.id));

    const detailedOrders = orderIds
      .map((id: string) => (ordersDetails as any)[id])
      .filter(Boolean);

    const totalOrders = detailedOrders.length;

    const revenue = detailedOrders.reduce((sum: number, o: any) => {
      const gt = Number(o.grandTotal ?? (Number(o.subtotal ?? 0) + Number(o.shipping ?? 0) + Number(o.taxes ?? 0)));
      return sum + gt;
    }, 0);

    const avgBasket = totalOrders > 0 ? revenue / totalOrders : 0;

    // top products par quantité
    const qtyByProductId: Record<string, number> = {};
    for (const o of detailedOrders) {
      for (const it of (o.items ?? [])) {
        const pid = String(it.productId ?? it.product?.id ?? it.id ?? '');
        if (!pid) continue;
        const q = Number(it.quantity ?? 1);
        qtyByProductId[pid] = (qtyByProductId[pid] ?? 0) + q;
      }
    }

    const topProducts = Object.entries(qtyByProductId)
      .map(([productId, qty]) => {
        const p: any = (products as any[]).find((x) => String(x.id) === String(productId));
        return {
          productId: Number(productId),
          name: p?.name ?? `Product #${productId}`,
          qty,
        };
      })
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return HttpResponse.json(
      {
        totalOrders,
        revenue,
        avgBasket,
        topProducts,
      },
      { status: 200 },
    );
  }),

  // GET /api/admin/orders/recent/?limit=10
  http.get(`${API}/admin/orders/recent/`, async ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || '10');

    const orderIds = (userProfile.orders ?? [])
      .map((o: any) => String(o.id))
      .slice()
      .reverse();

    const recent = orderIds
      .map((id: string) => (ordersDetails as any)[id])
      .filter(Boolean)
      .slice(0, limit)
      .map((o: any) => ({
        id: o.id,
        createdAt: o.createdAt ?? o.created_at ?? new Date().toISOString(),
        itemsCount: (o.items ?? []).reduce((s: number, it: any) => s + Number(it.quantity ?? 1), 0),
        total: Number(o.grandTotal ?? (Number(o.subtotal ?? 0) + Number(o.shipping ?? 0) + Number(o.taxes ?? 0))),
        status: o.status ?? 'PAID',
      }));

    return HttpResponse.json(recent, { status: 200 });
  }),

  // GET /api/admin/products/low-stock/
  http.get(`${API}/admin/products/low-stock/`, async () => {
    const getStock = (p: any) => (typeof p.stock === 'number' ? p.stock : (5 + (p.id % 6) * 3));
    const getThreshold = (p: any) => (typeof p.lowStockThreshold === 'number' ? p.lowStockThreshold : 3);

    const low = (products as any[])
      .map((p) => ({
        id: p.id,
        name: p.name,
        stock: getStock(p),
        lowStockThreshold: getThreshold(p),
      }))
      .filter((p) => p.stock <= p.lowStockThreshold)
      .sort((a, b) => a.stock - b.stock);

    return HttpResponse.json(low, { status: 200 });
  }),

];
