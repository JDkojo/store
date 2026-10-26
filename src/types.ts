export type Category = 'All' | 'Beverages' | 'Provisions' | 'Toiletries' | 'Detergents';

export type MobileNetwork = 'MTN' | 'Telecel' | 'AirtelTigo';

export type OrderStatus = 'new' | 'paid' | 'packed' | 'collected';

export type OrderSource = 'QR' | 'WhatsApp';

export interface Product {
  id: string;
  name: string;
  category: Category;
  size: string;
  price: number; // in GH₵
  image: string;
  description: string;
  popular?: boolean;
}

export interface ReadyPack {
  id: string;
  name: string;
  price: number; // in GH₵
  originalPrice: number;
  image: string;
  tagline: string;
  items: {
    productName: string;
    quantity: number;
    size: string;
  }[];
}

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  isPack?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  isPacked?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "A017"
  customerPhone: string;
  customerName: string;
  network: MobileNetwork;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  source: OrderSource;
  momoTransactionId?: string;
  createdAt: string;
  packedAt?: string;
  collectedAt?: string;
}

export type CustomerScreen = 'home' | 'cart' | 'checkout' | 'payment_waiting' | 'receipt';
export type AppViewMode = 'customer' | 'staff' | 'split' | 'poster';
