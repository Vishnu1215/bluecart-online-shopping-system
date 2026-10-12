import { db } from '../db/localStorageDb';
import { Product, ProductCategory, TimeDiscount } from '../types';
import { generateUniqueSku } from '../services/sku.service';
import { sanitizeInput } from '../services/sanitizer.service';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, createdResponse, errorResponse, ApiResponse } from './mockClient';

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  vendorId?: string;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
  includeInactive?: boolean; // admin/vendor view
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  mrp: number;
  stockQty: number;
  images: string[];
  vendorId: string;
  vendorName: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  mrp?: number;
  stockQty?: number;
  images?: string[];
  isActive?: boolean;
}

export const productsApi = {
  async getProducts(params: ProductFilterParams = {}): Promise<ApiResponse<PaginatedProducts>> {
    await simulateLatency();
    const allProducts = db.get('products') || [];
    
    // Filter active listings unless explicitly requested (e.g., admin console)
    let filtered = allProducts.filter(p => params.includeInactive ? true : p.isActive);

    // Vendor filter
    if (params.vendorId) {
      filtered = filtered.filter(p => p.vendorId === params.vendorId);
    }

    // Category filter
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Search query filter
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Price range
    if (params.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= params.maxPrice!);
    }

    // Rating filter (4* & above, 3* & above)
    if (params.minRating !== undefined) {
      filtered = filtered.filter(p => p.avgRating >= params.minRating!);
    }

    // In-stock only filter
    if (params.inStockOnly) {
      filtered = filtered.filter(p => p.stockQty > 0);
    }

    // Check active time discounts (FR-30)
    const now = new Date();
    filtered = filtered.map(p => {
      if (p.timeDiscount) {
        const from = new Date(p.timeDiscount.validFrom);
        const to = new Date(p.timeDiscount.validTo);
        if (now >= from && now <= to) {
          const discountPct = p.timeDiscount.percent;
          const discountedPrice = Math.round(p.price * (1 - discountPct / 100));
          return {
            ...p,
            price: discountedPrice,
            discountPercent: Math.max(p.discountPercent, discountPct)
          };
        }
      }
      return p;
    });

    // Sorting
    switch (params.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    const total = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return okResponse({
      products: paginatedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      limit
    });
  },

  async getProductById(idOrSku: string): Promise<ApiResponse<Product>> {
    await simulateLatency();
    const product = db.findOne<Product>('products', p => p.id === idOrSku || p.sku === idOrSku);
    if (!product) {
      return errorResponse(404, 'Product not found');
    }
    return okResponse(product);
  },

  async createProduct(dto: CreateProductDto, actor: string | { id: string; name: string; role: any } = 'admin'): Promise<ApiResponse<Product>> {
    await simulateLatency();
    const actorObj = typeof actor === 'string' ? { id: actor, name: actor.charAt(0).toUpperCase() + actor.slice(1), role: actor } : actor;
    if (!dto.name || !dto.category || !dto.price || dto.stockQty === undefined) {
      return errorResponse(400, 'Missing mandatory product fields (FR-08)');
    }

    if (dto.price <= 0 || dto.stockQty < 0) {
      return errorResponse(400, 'Price must be positive and stock non-negative.');
    }

    // Generate unique SKU (FR-09)
    const sku = generateUniqueSku(dto.category);
    const mrp = dto.mrp || Math.round(dto.price * 1.3);
    const discountPercent = Math.max(0, Math.round(((mrp - dto.price) / mrp) * 100));

    const newProduct: Product = {
      id: `prd_${Date.now()}`,
      sku,
      vendorId: dto.vendorId,
      vendorName: dto.vendorName,
      name: sanitizeInput(dto.name),
      description: sanitizeInput(dto.description || ''),
      category: dto.category,
      brand: sanitizeInput(dto.brand || 'BlueCart Choice'),
      price: dto.price,
      mrp,
      discountPercent,
      stockQty: dto.stockQty,
      images: dto.images && dto.images.length > 0 ? dto.images : ['default-box'],
      isActive: true,
      avgRating: 0,
      reviewCount: 0
    };

    db.insert<Product>('products', newProduct);

    logAuditEvent(actorObj, 'PRODUCT_CREATE', 'product', newProduct.id, null, newProduct);

    return createdResponse(newProduct, `Product created successfully with SKU ${sku}.`);
  },

  async updateProduct(id: string, dto: UpdateProductDto, actor: string | { id: string; name: string; role: any } = 'admin'): Promise<ApiResponse<Product>> {
    await simulateLatency();
    const existing = db.findById<Product>('products', id);
    if (!existing) {
      return errorResponse(404, 'Product not found');
    }

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: actor as any } : actor;
    const before = { ...existing };
    const updated = db.update<Product>('products', id, p => {
      if (dto.name !== undefined) p.name = sanitizeInput(dto.name);
      if (dto.description !== undefined) p.description = sanitizeInput(dto.description);
      if (dto.price !== undefined) {
        p.price = dto.price;
        if (p.mrp > p.price) {
          p.discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
        }
      }
      if (dto.mrp !== undefined) p.mrp = dto.mrp;
      if (dto.stockQty !== undefined) p.stockQty = dto.stockQty;
      if (dto.images !== undefined) p.images = dto.images;
      if (dto.isActive !== undefined) p.isActive = dto.isActive;
    });

    logAuditEvent(actorObj, 'PRODUCT_UPDATE', 'product', id, before, updated);

    return okResponse(updated!, 'Product updated successfully.');
  },

  async softDeleteProduct(id: string, actor: string | { id: string; name: string; role: any } = 'admin', reason?: string): Promise<ApiResponse<Product>> {
    await simulateLatency();
    const existing = db.findById<Product>('products', id);
    if (!existing) {
      return errorResponse(404, 'Product not found');
    }

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: actor as any } : actor;
    const before = { ...existing };
    const updated = db.update<Product>('products', id, p => {
      p.isActive = false;
      p.deletedAt = new Date().toISOString();
    });

    logAuditEvent(actorObj, 'PRODUCT_SOFT_DELETE', 'product', id, before, { ...updated, reason });

    return okResponse(updated!, 'Product deactivated (soft-deleted). Order history retained.');
  },

  async deactivateProduct(id: string, actor: string | { id: string; name: string; role: any } = 'admin', reason?: string): Promise<ApiResponse<Product>> {
    return this.softDeleteProduct(id, actor, reason);
  },

  async reactivateProduct(id: string, actor: string | { id: string; name: string; role: any } = 'admin'): Promise<ApiResponse<Product>> {
    await simulateLatency();
    const existing = db.findById<Product>('products', id);
    if (!existing) {
      return errorResponse(404, 'Product not found');
    }

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: actor as any } : actor;
    const before = { ...existing };
    const updated = db.update<Product>('products', id, p => {
      p.isActive = true;
      p.deletedAt = null;
    });

    logAuditEvent(actorObj, 'PRODUCT_REACTIVATE', 'product', id, before, updated);

    return okResponse(updated!, 'Product reactivated successfully.');
  },

  async configureTimeDiscount(id: string, discount: TimeDiscount, actor: string | { id: string; name: string; role: any } = 'vendor'): Promise<ApiResponse<Product>> {
    await simulateLatency();
    const existing = db.findById<Product>('products', id);
    if (!existing) {
      return errorResponse(404, 'Product not found');
    }

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: actor as any } : actor;
    const before = { ...existing };
    const updated = db.update<Product>('products', id, p => {
      p.timeDiscount = discount;
    });

    logAuditEvent(actorObj, 'PRODUCT_TIME_DISCOUNT_SET', 'product', id, before, updated);

    return okResponse(updated!, 'Promotional discount scheduled successfully.');
  },

  async applyTimeDiscount(id: string, discount: TimeDiscount, actor: string | { id: string; name: string; role: any } = 'vendor'): Promise<ApiResponse<Product>> {
    return this.configureTimeDiscount(id, discount, actor);
  }
};
