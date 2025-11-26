export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  owner_id: number;
  ratings: { user_id: number; value: number }[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Stylo Bleu',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    owner_id: 10,
    ratings: [{ user_id: 2, value: 4 }],
  },
  {
    id: 2,
    name: 'Cahier A5',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    owner_id: 11,
    ratings: [{ user_id: 3, value: 5 }],
  },

  {
    id: 3,
    name: 'Classeur Rouge',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    owner_id: 12,
    ratings: [{ user_id: 4, value: 3 }],
  },
  {
    id: 4,
    name: 'Crayon HB',
    price: 1.2,
    created_at: '2025-03-01T08:45:00Z',
    owner_id: 13,
    ratings: [{ user_id: 2, value: 5 }],
  },
  {
    id: 5,
    name: 'Règle 30cm',
    price: 1.5,
    created_at: '2025-03-05T07:20:00Z',
    owner_id: 14,
    ratings: [{ user_id: 1, value: 4 }],
  },
  {
    id: 6,
    name: 'Gomme Blanche',
    price: 0.9,
    created_at: '2025-03-10T14:10:00Z',
    owner_id: 15,
    ratings: [{ user_id: 3, value: 4 }],
  },
  {
    id: 7,
    name: 'Surligneur Jaune',
    price: 1.7,
    created_at: '2025-03-11T11:00:00Z',
    owner_id: 16,
    ratings: [{ user_id: 6, value: 5 }],
  },
  {
    id: 8,
    name: 'Pochette Plastique',
    price: 0.3,
    created_at: '2025-03-12T09:00:00Z',
    owner_id: 17,
    ratings: [{ user_id: 3, value: 3 }],
  },
  {
    id: 9,
    name: 'Feutre Noir',
    price: 2.0,
    created_at: '2025-03-15T10:30:00Z',
    owner_id: 18,
    ratings: [{ user_id: 5, value: 4 }],
  },
  {
    id: 10,
    name: 'Bloc Notes',
    price: 3.0,
    created_at: '2025-03-20T16:00:00Z',
    owner_id: 19,
    ratings: [{ user_id: 7, value: 5 }],
  },
  {
    id: 11,
    name: 'Feuilles A4',
    price: 4.0,
    created_at: '2025-03-22T12:40:00Z',
    owner_id: 20,
    ratings: [{ user_id: 2, value: 4 }],
  },
  {
    id: 12,
    name: 'Trousse Bleue',
    price: 6.5,
    created_at: '2025-03-25T13:00:00Z',
    owner_id: 21,
    ratings: [{ user_id: 8, value: 5 }],
  },
  {
    id: 13,
    name: 'Colle Bâton',
    price: 1.3,
    created_at: '2025-04-01T07:00:00Z',
    owner_id: 10,
    ratings: [{ user_id: 9, value: 3 }],
  },
  {
    id: 14,
    name: 'Ruban Adhésif',
    price: 2.8,
    created_at: '2025-04-03T08:00:00Z',
    owner_id: 11,
    ratings: [{ user_id: 1, value: 4 }],
  },
  {
    id: 15,
    name: 'Stylo Rouge',
    price: 2.5,
    created_at: '2025-04-05T10:20:00Z',
    owner_id: 12,
    ratings: [{ user_id: 3, value: 5 }],
  },
  {
    id: 16,
    name: 'Feutres Couleur (Pack x10)',
    price: 7.9,
    created_at: '2025-04-10T14:00:00Z',
    owner_id: 13,
    ratings: [{ user_id: 6, value: 4 }],
  },
  {
    id: 17,
    name: 'Pinceau Fin',
    price: 2.2,
    created_at: '2025-04-12T12:30:00Z',
    owner_id: 14,
    ratings: [{ user_id: 5, value: 3 }],
  },
  {
    id: 18,
    name: 'Palette Aquarelle',
    price: 9.5,
    created_at: '2025-04-15T11:10:00Z',
    owner_id: 15,
    ratings: [{ user_id: 8, value: 5 }],
  },
  {
    id: 19,
    name: 'Marqueur Effaçable',
    price: 3.4,
    created_at: '2025-04-18T09:40:00Z',
    owner_id: 16,
    ratings: [{ user_id: 2, value: 4 }],
  },
  {
    id: 20,
    name: 'Tampon Encreur',
    price: 5.0,
    created_at: '2025-04-20T15:00:00Z',
    owner_id: 17,
    ratings: [{ user_id: 9, value: 4 }],
  },
];

// --- User & orders mock data ---

export interface MockAddress {
  line1: string;
  line2?: string;
  city: string;
  zip: string;
  country: string;
}

export interface MockOrderItem {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export type MockOrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface MockOrderSummary {
  id: string;
  createdAt: string;
  status: MockOrderStatus;
  total: number;
  currency: string;
}

export interface MockOrderDetail extends MockOrderSummary {
  items: MockOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  taxes: number;
  grandTotal: number;
  shippingAddress: MockAddress;
}

export interface MockUserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: MockAddress;
  preferences: {
    newsletter: boolean;
    defaultMinRating?: number;
  };
  orders: MockOrderSummary[];
}

const defaultAddress: MockAddress = {
  line1: '12 Rue du Commerce',
  city: 'Genève',
  zip: '1200',
  country: 'Suisse',
};

export const userProfile: MockUserProfile = {
  id: 'u-1',
  username: 'demo-user',
  email: 'demo@myshop.ch',
  fullName: 'Demo User',
  defaultAddress: defaultAddress,
  preferences: {
    newsletter: true,
    defaultMinRating: 3,
  },
  orders: [
    {
      id: 'ORD-1001',
      createdAt: '2025-04-10T09:15:00Z',
      status: 'delivered',
      total: 120.5,
      currency: 'CHF',
    },
    {
      id: 'ORD-1002',
      createdAt: '2025-04-25T15:30:00Z',
      status: 'shipped',
      total: 45.9,
      currency: 'CHF',
    },
  ],
};

export const ordersDetails: Record<string, MockOrderDetail> = {
  'ORD-1001': {
    id: 'ORD-1001',
    createdAt: '2025-04-10T09:15:00Z',
    status: 'delivered',
    total: 120.5,
    currency: 'CHF',
    items: [
      {
        productId: 1,
        name: 'Stylo Bleu',
        unitPrice: 2.5,
        quantity: 10,
        total: 25,
      },
      {
        productId: 4,
        name: 'Cahier A4',
        unitPrice: 3.9,
        quantity: 15,
        total: 58.5,
      },
      {
        productId: 7,
        name: 'Classeur Dos Large',
        unitPrice: 7.0,
        quantity: 5,
        total: 35,
      },
    ],
    subtotal: 118.5,
    discount: 5,
    shipping: 4.9,
    taxes: 2.1,
    grandTotal: 120.5,
    shippingAddress: defaultAddress,
  },
  'ORD-1002': {
    id: 'ORD-1002',
    createdAt: '2025-04-25T15:30:00Z',
    status: 'shipped',
    total: 45.9,
    currency: 'CHF',
    items: [
      {
        productId: 2,
        name: 'Bloc-notes Jaune',
        unitPrice: 3.2,
        quantity: 3,
        total: 9.6,
      },
      {
        productId: 5,
        name: 'Surlineur Pastel',
        unitPrice: 2.9,
        quantity: 8,
        total: 23.2,
      },
    ],
    subtotal: 42.8,
    discount: 0,
    shipping: 3.1,
    taxes: 0,
    grandTotal: 45.9,
    shippingAddress: defaultAddress,
  },
};
