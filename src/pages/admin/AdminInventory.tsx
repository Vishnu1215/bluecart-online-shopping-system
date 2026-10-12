import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { productsApi } from '../../api/products.api';
import { reportsApi } from '../../api/reports.api';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';
import { Package, Download, SlidersHorizontal, Plus, AlertTriangle } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [threshold, setThreshold] = useState<number>(40);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState('50');

  const loadProducts = async () => {
    const res = await productsApi.getProducts({ limit: 100, includeInactive: true });
    if (res.success && res.data) {
      setProducts(res.data.products);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleExecuteRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct || !restockQty) return;

    const added = parseInt(restockQty, 10);
    const newStock = restockProduct.stockQty + added;

    const res = await productsApi.updateProduct(restockProduct.id, { stockQty: newStock }, 'admin');
    if (res.success) {
      success(`Restocked ${restockProduct.sku} (+${added} units). New stock: ${newStock}.`);
      setRestockProduct(null);
      loadProducts();
    } else {
      error(res.error || 'Failed to restock');
    }
  };

  const handleExportCsv = () => {
    const rows = products.map(p => ({
      SKU: p.sku,
      Product: p.name,
      Category: p.category,
      Distributor: p.vendorName,
      StockUnits: p.stockQty,
      Status: p.stockQty <= threshold ? 'Low Stock' : 'Healthy'
    }));
    reportsApi.exportCsv(rows, 'inventory_audit_report.csv');
  };

  return (
    <ConsoleLayout role="admin" title="Inventory Threshold & Restock Governance (Fig 8.25)">
      <div className="space-y-6">
        {/* Threshold Control Banner matching Fig 8.25 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Low-Stock Trigger Configuration
            </h2>
            <p className="text-xs text-slate-500">
              System flags listings below this unit threshold as Low Stock and issues automated notifications.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Alert Threshold:</span>
              <input
                type="number"
                value={threshold}
                onChange={e => setThreshold(parseInt(e.target.value, 10) || 40)}
                className="w-16 text-xs font-bold text-center px-2 py-1 rounded border bg-white dark:bg-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">units</span>
            </div>

            <Button size="sm" variant="outline" onClick={handleExportCsv} className="flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export CSV (FR-35)
            </Button>
          </div>
        </div>

        {/* Table matching Fig 8.25 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Distributor</th>
                  <th className="py-3 px-4">Stock Level Progress</th>
                  <th className="py-3 px-4">Status Pill</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => {
                  const isLow = p.stockQty <= threshold;
                  const pct = Math.min(100, Math.round((p.stockQty / 150) * 100));

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">{p.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs line-clamp-1">{p.name}</td>
                      <td className="py-3.5 px-4">{p.category}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.vendorName}</td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              p.stockQty <= 0 ? 'bg-slate-400' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.stockQty <= 0 ? (
                          <Badge variant="danger">Out of Stock</Badge>
                        ) : isLow ? (
                          <Badge variant="warning">Low Stock ({p.stockQty})</Badge>
                        ) : (
                          <Badge variant="success">Healthy ({p.stockQty})</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRestockProduct(p);
                            setRestockQty('50');
                          }}
                        >
                          Restock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restock Modal */}
        {restockProduct && (
          <Modal
            isOpen={true}
            onClose={() => setRestockProduct(null)}
            title={`Restock Listing: ${restockProduct.sku}`}
          >
            <form onSubmit={handleExecuteRestock} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                <p><strong>Product:</strong> {restockProduct.name}</p>
                <p><strong>Current Units:</strong> {restockProduct.stockQty}</p>
                <p><strong>Distributor:</strong> {restockProduct.vendorName}</p>
              </div>

              <div>
                <label className="font-bold block mb-1">Additional Units to Add *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={e => setRestockQty(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setRestockProduct(null)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Confirm Restock
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
