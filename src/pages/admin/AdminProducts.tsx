import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ProductImage } from '../../components/ui/ProductImage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { productsApi } from '../../api/products.api';
import { useToast } from '../../context/ToastContext';
import { Product, ProductCategory } from '../../types';
import { generateUniqueSku } from '../../services/sku.service';
import { Plus, Edit2, Trash2, RotateCcw, Search, Filter } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Deactivate confirm
  const [deactivatingProduct, setDeactivatingProduct] = useState<Product | null>(null);

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Audio');
  const [brand, setBrand] = useState('Generic');
  const [price, setPrice] = useState('2999');
  const [mrp, setMrp] = useState('3999');
  const [stockQty, setStockQty] = useState('50');
  const [vendorName, setVendorName] = useState('TechWest Retail');
  const [generatedSku, setGeneratedSku] = useState('');

  const loadProducts = async () => {
    setIsLoading(true);
    const res = await productsApi.getProducts({ limit: 100, includeInactive: true });
    if (res.success && res.data) {
      setProducts(res.data.products);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory('Audio');
    setBrand('Generic');
    setPrice('2999');
    setMrp('3999');
    setStockQty('50');
    setVendorName('TechWest Retail');
    setGeneratedSku(generateUniqueSku('Audio'));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setBrand(p.brand);
    setPrice(p.price.toString());
    setMrp(p.mrp.toString());
    setStockQty(p.stockQty.toString());
    setVendorName(p.vendorName);
    setGeneratedSku(p.sku);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const res = await productsApi.updateProduct(editingProduct.id, {
        name,
        description,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        stockQty: parseInt(stockQty, 10)
      }, 'admin');
      if (res.success) {
        success('Product updated by Administrator.');
        setIsModalOpen(false);
        loadProducts();
      }
    } else {
      const res = await productsApi.createProduct({
        name,
        description,
        category,
        brand,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        stockQty: parseInt(stockQty, 10),
        images: ['box', 'detail', 'battery', 'box'],
        vendorId: 'vnd_techwest',
        vendorName
      }, 'admin');
      if (res.success) {
        success(`Product ${res.data?.sku} created and logged in audit trail.`);
        setIsModalOpen(false);
        loadProducts();
      }
    }
  };

  // Soft-delete deactivation (FR-13 & SRS 5.2)
  const handleConfirmDeactivate = async () => {
    if (!deactivatingProduct) return;
    const res = await productsApi.deactivateProduct(deactivatingProduct.id, 'admin');
    if (res.success) {
      success(`Product ${deactivatingProduct.sku} deactivated (soft-deleted). Retained in 30-day recovery window.`);
      setDeactivatingProduct(null);
      loadProducts();
    } else {
      error(res.error || 'Failed to deactivate product');
    }
  };

  const handleReactivate = async (p: Product) => {
    const res = await productsApi.reactivateProduct(p.id, 'admin');
    if (res.success) {
      success(`Product ${p.sku} reactivated to active storefront catalogue.`);
      loadProducts();
    } else {
      error(res.error || 'Failed to reactivate product');
    }
  };

  const filtered = products.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !search.trim() || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <ConsoleLayout role="admin" title="Product Management (FR-08, FR-12, FR-13)">
      <div className="space-y-6">
        {/* Controls strip matching Fig 8.22 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Computers">Computers</option>
              <option value="Wearables">Wearables</option>
              <option value="Footwear">Footwear</option>
              <option value="Cameras">Cameras</option>
              <option value="Bags">Bags</option>
            </select>
          </div>

          <Button size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Product (FR-08)
          </Button>
        </div>

        {/* Table matching Fig 8.22 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Distributor</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Listing Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{p.sku}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800">
                          <ProductImage
                            category={p.category}
                            productId={p.id}
                            src={p.images[0]}
                            size="sm"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{p.name}</p>
                          <span className="text-[10px] text-slate-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{p.category}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{p.vendorName}</td>
                    <td className="py-3.5 px-4 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      {p.stockQty <= 0 ? (
                        <span className="text-rose-600 font-bold">0 (Out)</span>
                      ) : p.stockQty <= 40 ? (
                        <span className="text-amber-600 font-bold">{p.stockQty} (Low)</span>
                      ) : (
                        <span>{p.stockQty}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Deactivated (30-day recovery)</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-slate-600 hover:text-primary rounded hover:bg-slate-100"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {p.isActive ? (
                          <button
                            onClick={() => setDeactivatingProduct(p)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                            title="Soft-Delete Deactivate (FR-13)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(p)}
                            className="p-1 text-emerald-600 hover:text-emerald-700 rounded hover:bg-slate-100"
                            title="Reactivate Listing"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Soft-Delete Confirmation Dialog */}
        {deactivatingProduct && (
          <ConfirmDialog
            isOpen={true}
            title={`Deactivate Product: ${deactivatingProduct.sku}?`}
            message={`Are you sure you want to deactivate "${deactivatingProduct.name}"? Per SRS 5.2 & FR-13, this performs a soft-delete: the product will be hidden from the customer storefront, historical orders will retain complete fidelity, and recovery is enabled for 30 days.`}
            confirmText="Deactivate Listing"
            confirmVariant="danger"
            onConfirm={handleConfirmDeactivate}
            onCancel={() => setDeactivatingProduct(null)}
          />
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title={editingProduct ? `Edit Product ${editingProduct.sku}` : 'Add Product to Catalog (FR-08)'}
          >
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-between border border-blue-200">
                <span className="font-bold text-primary">SKU (FR-09):</span>
                <span className="font-mono font-bold">{generatedSku}</span>
              </div>
              <Input label="Title" value={name} onChange={e => setName(e.target.value)} />
              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg bg-white dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Brand" value={brand} onChange={e => setBrand(e.target.value)} />
                <Input label="Distributor" value={vendorName} onChange={e => setVendorName(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                <Input label="MRP (₹)" type="number" value={mrp} onChange={e => setMrp(e.target.value)} />
                <Input label="Stock" type="number" value={stockQty} onChange={e => setStockQty(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button size="sm" type="submit">Save</Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
