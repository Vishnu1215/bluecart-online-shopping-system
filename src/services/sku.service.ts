import { ProductCategory } from '../types';
import { db } from '../db/localStorageDb';

const categoryPrefixMap: Record<ProductCategory, string> = {
  'Audio': 'AUD',
  'Wearables': 'WRB',
  'Footwear': 'FTW',
  'Mobiles': 'MOB',
  'Computers': 'CMP',
  'Cameras': 'CAM',
  'Bags': 'BAG'
};

export function getCategoryPrefix(category: ProductCategory): string {
  return categoryPrefixMap[category] || category.substring(0, 3).toUpperCase();
}

/**
 * Automatically generates a unique SKU upon product creation (FR-09)
 * Format: <CATEGORY3>-<4-digit sequence> (e.g., AUD-0001, CAT-0001)
 */
export function generateUniqueSku(category: ProductCategory): string {
  const prefix = getCategoryPrefix(category);
  const products = db.get('products') || [];
  
  // Find highest sequence for this prefix
  let maxSeq = 0;
  for (const p of products) {
    if (p.sku && p.sku.startsWith(`${prefix}-`)) {
      const numPart = parseInt(p.sku.replace(`${prefix}-`, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const seqStr = String(nextSeq).padStart(4, '0');
  const candidate = `${prefix}-${seqStr}`;

  // Double check uniqueness across all products
  const exists = products.some(p => p.sku === candidate);
  if (!exists) {
    return candidate;
  }

  // Fallback if collision
  return `${prefix}-${String(maxSeq + 2).padStart(4, '0')}`;
}
