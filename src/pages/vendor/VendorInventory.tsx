import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { productsApi } from '../../api/products.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';
import { Package, Plus, Minus, AlertTriangle, ArrowUpDown, History } from 'lucide-react';

export const VendorInventory: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const vendorId = user?.vendorId || 'vnd_techwest';

  const [products, setProducts] = useState<Product[]>([]);
  const [restockLogs, setRestockLogs] = useState<Array<{ sku: string; name: string; qtyAdded: number; time: string }>>([
    { sku: 'AUD-0001', name: 'Aurora Wireless Headphones', qtyAdded: 50, time: '10 Oct 2026, 14:30' },
    { sku: 'CMP-0008', name: 'AeroBook 14 Laptop', qtyAdded: 10, time: '09 Oct 2026, 09:15' },
  ]);

  const loadProducts = async () => {
    const res = await productsApi.getProducts({ vendorId, limit: 100, includeInactive: true });
    if (res.success && res.data) {
      setProducts(res.data.products);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [vendorId]);

  const handleQuickStockUpdate = async (product: Product, delta: number) => {
    const newQty = Math.max(0, product.stockQty + delta);
    const res = await productsApi.updateProduct(product.id, { stockQty: newQty }, 'vendor');
    if (res.success) {
      success(`Updated stock for ${product.sku} to ${newQty}`);
      if (delta > 0) {
        setRestockLogs(prev => [
          { sku: product.sku, name: product.name, qtyAdded: delta, time: new Date().toLocaleString('en-IN') },
          ...prev
        ]);
      }
      loadProducts();
    } else {
      error(res.error || 'Failed to update stock');
    }
  };

  return (
    <ConsoleLayout role="vendor" title="Inventory & Stock Availability (FR-12)">
      <div className="space-y-8">
        {/* Inventory Summary Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Live Stock Inventory Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust stock units in real-time. Quantities automatically decrement upon customer checkout (FR-11).
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            Low Stock Threshold: ≤ 40 units
          </span>
        </div>

        {/* Stock Level Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock Level Progress</th>
                  <th className="py-3 px-4">Units Available</th>
                  <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => {
                  const pct = Math.min(100, Math.round((p.stockQty / 150) * 100));
                  const isLow = p.stockQty <= 40;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">{p.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs line-clamp-1">{p.name}</td>
                      <td className="py-3.5 px-4">{p.category}</td>
                      <td className="py-3.5 px-4 w-48">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${
                              p.stockQty <= 0 ? 'bg-slate-400' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                          {p.stockQty} Units {isLow && '(Low)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickStockUpdate(p, -5)}
                            disabled={p.stockQty <= 0}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold disabled:opacity-40"
                            title="Decrease 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p, -1)}
                            disabled={p.stockQty <= 0}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold disabled:opacity-40"
                            title="Decrease 1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p, 1)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-primary rounded font-bold"
                            title="Increase 1"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p, 10)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-primary rounded font-bold"
                            title="Restock 10"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restock Logs Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> Recent Restock Log
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {restockLogs.map((log, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{log.name} ({log.sku})</p>
                  <p className="text-[11px] text-slate-400">{log.time}</p>
                </div>
                <span className="font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">
                  +{log.qtyAdded} Units Supplied
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
