export type UserRole = 'customer' | 'vendor' | 'admin';

export type UserStatus = 'Active' | 'Locked' | 'Suspended' | 'Pending';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string; // bcrypt hash
  role: UserRole;
  status: UserStatus;
  failedAttempts: number;
  lockUntil: number | null; // timestamp in ms
  vendorId?: string; // linked vendor if vendor role
  createdAt: string;
  avatar?: string;
  savedAddresses?: Address[];
  preferences?: {
    orderNotifications: boolean;
    shippingNotifications: boolean;
  };
}

export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  status: 'Approved' | 'Pending' | 'Suspended';
  commissionRate: number; // default e.g. 10%
  description?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type ProductCategory = 
  | 'Mobiles' 
  | 'Computers' 
  | 'Audio' 
  | 'Wearables' 
  | 'Footwear' 
  | 'Cameras' 
  | 'Bags';

export interface TimeDiscount {
  percent: number;
  validFrom: string; // ISO date
  validTo: string;   // ISO date
  description?: string;
}

export interface Product {
  id: string;
  sku: string; // e.g. AUD-0001
  vendorId: string;
  vendorName: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number; // selling price
  mrp: number;   // maximum retail price (struck-through)
  discountPercent: number;
  stockQty: number;
  images: string[]; // preset icon or illustration keys
  isActive: boolean; // soft delete flag
  deletedAt?: string | null;
  avgRating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  features?: string[];
  timeDiscount?: TimeDiscount;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  mrp: number;
  qty: number;
  image: string;
  vendorId: string;
}

export interface Cart {
  id?: string;
  userId: string;
  items: CartItem[];
  couponCode?: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Return Requested' 
  | 'Returned' 
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  vendorId: string;
  image: string;
}

export interface StatusTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note: string;
  changedBy: string; // Actor role or 'System'
}

export interface Order {
  id: string; // Mongo ID
  orderId: string; // e.g. ORD-2026-0043
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  subtotal: number;
  couponDiscount: number;
  couponCode?: string;
  taxAmount: number; // 18% GST
  totalAmount: number;
  status: OrderStatus;
  placedAt: string;
  updatedAt: string;
  deliveredAt?: string;
  statusTimeline: StatusTimelineEntry[];
  cancelReason?: string;
  returnReason?: string;
  adminOverrideReason?: string;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';
export type PaymentStatus = 'Paid' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  orderId: string;
  gatewayRef: string; // e.g. PAY-GATE-XXXX
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
  cardLast4?: string;
  upiId?: string;
  bankName?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  sku: string;
  productId: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  createdAt: string;
  isActive: boolean;
  verifiedPurchase: boolean;
}

export interface Coupon {
  id: string;
  code: string; // uppercase, e.g. SAVE10
  type: 'percent' | 'flat';
  value: number; // e.g. 10 for 10% or 200 for ₹200
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  minOrderValue?: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'system';
  action: string;
  entity: 'product' | 'order' | 'user' | 'vendor' | 'coupon' | 'review' | 'inventory';
  entityId: string;
  before: any;
  after: any;
  timestamp: string;
  ipAddress?: string;
}

export interface Notification {
  id: string;
  userId: string; // can be 'admin' or specific user ID or vendor ID
  title: string;
  message: string;
  type: 'order' | 'status' | 'alert' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Resolved';
  createdAt: string;
}
