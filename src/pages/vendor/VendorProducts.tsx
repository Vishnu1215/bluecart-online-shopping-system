import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ProductImage } from '../../components/ui/ProductImage';
import { productsApi } from '../../api/products.api';
import { generateUniqueSku } from '../../services/sku.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Product, ProductCategory } from '../../types';
import { Plus, Edit2, Search, Package, Sparkles } from 'lucide-react';

export const VendorProducts: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const vendorId = user?.vendorId || 'vnd_techwest';
  const vendorName = user?.name || 'TechWest Retail';

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Audio');
  const [brand, setBrand] = useState('TechWest');
  const [price, setPrice] = useState('2999');
  const [mrp, setMrp] = useState('3999');
  const [stockQty, setStockQty] = useState('50');
  const [generatedSku, setGeneratedSku] = useState('');

  const loadProducts = async () => {
    setIsLoading(true);
    const res = await productsApi.getProducts({ vendorId, limit: 100, includeInactive: true });
    if (res.success && res.data) {
      setProducts(res.data.products);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [vendorId]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory('Audio');
    setBrand('TechWest');
    setPrice('2999');
    setMrp('3999');
    setStockQty('50');
    // Generate unique SKU (FR-09)
    const sku = generateUniqueSku('Audio');
    setGeneratedSku(sku);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setBrand(p.brand);
    setPrice(p.price.toString());
    setMrp(p.mrp.toString());
    setStockQty(p.stockQty.toString());
    setGeneratedSku(p.sku);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (!editingProduct) {
      setGeneratedSku(generateUniqueSku(newCat));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !stockQty) {
      error('Please fill in all mandatory fields');
      return;
    }

    if (editingProduct) {
      // Edit product (FR-12)
      const res = await productsApi.updateProduct(editingProduct.id, {
        name,
        description,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        stockQty: parseInt(stockQty, 10)
      }, 'vendor');

      if (res.success) {
        success('Product listing updated successfully.');
        setIsModalOpen(false);
        loadProducts();
      } else {
        error(res.error || 'Failed to update product');
      }
    } else {
      // Add product with auto SKU (FR-08, FR-09)
      const res = await productsApi.createProduct({
        name,
        description,
        category,
        brand,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        stockQty: parseInt(stockQty, 10),
        images: ['box', 'detail', 'battery', 'box'],
        vendorId,
        vendorName
      }, 'vendor');

      if (res.success) {
        success(`Product created with unique SKU: ${res.data?.sku}`);
        setIsModalOpen(false);
        loadProducts();
      } else {
        error(res.error || 'Failed to create product');
      }
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
    <ConsoleLayout role="vendor" title="My Assigned Products">
      <div className="space-y-6">
        {/* Controls strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products or SKU..."
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

          <Button size="sm" onClick={handleOpenAddModal} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Product (Auto SKU)
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / MRP</th>
                  <th className="py-3 px-4">Stock Availability</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
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
                    <td className="py-3.5 px-4">
                      <span className="font-bold">₹{p.price.toLocaleString('en-IN')}</span>{' '}
                      <span className="text-slate-400 line-through text-[11px]">₹{p.mrp.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.stockQty <= 0 ? (
                        <Badge variant="danger">Out of Stock</Badge>
                      ) : p.stockQty <= 40 ? (
                        <Badge variant="warning">{p.stockQty} Units (Low)</Badge>
                      ) : (
                        <Badge variant="success">{p.stockQty} Units</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium">★ {p.avgRating.toFixed(1)} ({p.reviewCount})</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1 text-slate-600 hover:text-primary rounded hover:bg-slate-100"
                        title="Edit Price & Stock (FR-12)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title={editingProduct ? `Edit Product: ${editingProduct.sku}` : 'Add New Product (FR-08)'}
          >
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-between border border-blue-200">
                <span className="font-bold text-primary">Auto-Generated Unique SKU (FR-09):</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-3 py-1 rounded border">
                  {generatedSku}
                </span>
              </div>

              <Input
                label="Product Title"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Wireless Pro Earbuds"
              />

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="Detailed technical features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    disabled={!!editingProduct}
                    value={category}
                    onChange={e => handleCategoryChange(e.target.value as ProductCategory)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Computers">Computers</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>

                <Input
                  label="Brand"
                  value={brand}
                  disabled={!!editingProduct}
                  onChange={e => setBrand(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Selling Price (₹)"
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
                <Input
                  label="MRP (₹)"
                  type="number"
                  value={mrp}
                  onChange={e => setMrp(e.target.value)}
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={stockQty}
                  onChange={e => setStockQty(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  {editingProduct ? 'Save Changes' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
