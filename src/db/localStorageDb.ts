import { 
  User, Vendor, Product, Cart, Order, Payment, Review, Coupon, AuditLog, Notification, ContactMessage 
} from '../types';
import { 
  initialUsers, initialVendors, initialProducts, initialCoupons, initialOrders, 
  initialPayments, initialReviews, initialAuditLogs, initialNotifications, initialContactMessages 
} from './seedData';

export const DB_STORAGE_KEY = 'bluecart_db_v2';

export interface DatabaseSchema {
  version: string;
  users: User[];
  vendors: Vendor[];
  products: Product[];
  carts: Cart[];
  orders: Order[];
  payments: Payment[];
  reviews: Review[];
  coupons: Coupon[];
  audit_logs: AuditLog[];
  notifications: Notification[];
  contact_messages: ContactMessage[];
  systemSettings: {
    lowStockThreshold: number; // default 40
    returnWindowDays: number;   // default 7
    taxRatePct: number;         // default 18
    freeShippingThreshold: number; // default 5000
    standardShippingFee: number;   // default 49
    expressShippingFee: number;    // default 149
  };
}

const defaultInitialDb: DatabaseSchema = {
  version: '1.0.0',
  users: initialUsers,
  vendors: initialVendors,
  products: initialProducts,
  carts: [
    {
      userId: 'usr_ananya',
      items: [
        {
          productId: 'prd_aurora',
          sku: 'AUD-0001',
          name: 'Aurora Wireless Headphones',
          price: 3499,
          mrp: 4999,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          vendorId: 'vnd_techwest'
        }
      ],
      updatedAt: new Date().toISOString()
    }
  ],
  orders: initialOrders,
  payments: initialPayments,
  reviews: initialReviews,
  coupons: initialCoupons,
  audit_logs: initialAuditLogs,
  notifications: initialNotifications,
  contact_messages: initialContactMessages,
  systemSettings: {
    lowStockThreshold: 40,
    returnWindowDays: 7,
    taxRatePct: 18,
    freeShippingThreshold: 5000,
    standardShippingFee: 49,
    expressShippingFee: 149
  }
};

const inMemoryStore: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {}
  return inMemoryStore[key] || null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {}
  inMemoryStore[key] = value;
}

class LocalStorageDatabase {
  private getRaw(): DatabaseSchema {
    try {
      const raw = getStorageItem(DB_STORAGE_KEY);
      if (!raw) {
        this.saveRaw(defaultInitialDb);
        return defaultInitialDb;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.version || !parsed.products || !parsed.users) {
        this.saveRaw(defaultInitialDb);
        return defaultInitialDb;
      }
      return parsed;
    } catch {
      this.saveRaw(defaultInitialDb);
      return defaultInitialDb;
    }
  }

  private saveRaw(db: DatabaseSchema): void {
    try {
      setStorageItem(DB_STORAGE_KEY, JSON.stringify(db));
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('bluecart_db_updated'));
      }
    } catch (err) {
      console.error('Failed to write to database:', err);
    }
  }

  public init(): DatabaseSchema {
    return this.getRaw();
  }

  public reset(): DatabaseSchema {
    this.saveRaw(defaultInitialDb);
    return defaultInitialDb;
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    const db = this.getRaw();
    return db[collection];
  }

  public set<K extends keyof DatabaseSchema>(collection: K, data: DatabaseSchema[K]): void {
    const db = this.getRaw();
    db[collection] = data;
    this.saveRaw(db);
  }

  public find<T extends { id?: string; userId?: string }>(collection: keyof DatabaseSchema, predicate: (item: T) => boolean): T[] {
    const items = (this.get(collection) as unknown as T[]) || [];
    return items.filter(predicate);
  }

  public findOne<T extends { id?: string; userId?: string }>(collection: keyof DatabaseSchema, predicate: (item: T) => boolean): T | undefined {
    const items = (this.get(collection) as unknown as T[]) || [];
    return items.find(predicate);
  }

  public findById<T extends { id?: string; userId?: string }>(collection: keyof DatabaseSchema, id: string): T | undefined {
    const items = (this.get(collection) as unknown as T[]) || [];
    return items.find(item => item.id === id || item.userId === id);
  }

  public insert<T extends { id?: string; userId?: string }>(collection: keyof DatabaseSchema, item: T): T {
    const db = this.getRaw();
    const items = (db[collection] as unknown as T[]) || [];
    items.unshift(item);
    this.saveRaw(db);
    return item;
  }

  public update<T extends { id?: string; userId?: string }>(collection: keyof DatabaseSchema, id: string, updater: (item: T) => Partial<T> | void): T | undefined {
    const db = this.getRaw();
    const items = (db[collection] as unknown as T[]) || [];
    const index = items.findIndex(item => item.id === id || item.userId === id);
    if (index === -1) return undefined;
    
    const current = items[index];
    const updateResult = updater(current);
    if (updateResult) {
      items[index] = { ...current, ...updateResult };
    }
    this.saveRaw(db);
    return items[index];
  }

  public delete<T extends { id?: string; userId?: string }>(collection: keyof DatabaseSchema, id: string): boolean {
    const db = this.getRaw();
    const items = (db[collection] as unknown as T[]) || [];
    const filtered = items.filter(item => item.id !== id && item.userId !== id);
    if (filtered.length === items.length) return false;
    (db[collection] as unknown as T[]) = filtered;
    this.saveRaw(db);
    return true;
  }
}

export const db = new LocalStorageDatabase();
