import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { reportsApi, SalesReportSummary } from '../../api/reports.api';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import { BarChart3, Download, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const VendorReports: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.vendorId || 'vnd_techwest';

  const [report, setReport] = useState<SalesReportSummary | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadReport = async () => {
    const [salesRes, stockRes] = await Promise.all([
      reportsApi.getSalesReport({ vendorId, startDate, endDate }),
      reportsApi.getLowStockReport(40)
    ]);

    if (salesRes.success && salesRes.data) {
      setReport(salesRes.data);
    }
    if (stockRes.success && stockRes.data) {
      // Filter vendor's low stock items
      setLowStock(stockRes.data.filter(p => p.vendorId === vendorId));
    }
  };

  useEffect(() => {
    loadReport();
  }, [vendorId, startDate, endDate]);

  const handleExportSalesCsv = () => {
    if (!report) return;
    reportsApi.exportCsv(report.salesByCategory, 'vendor_sales_by_category.csv');
  };

  const handleExportStockCsv = () => {
    reportsApi.exportCsv(
      lowStock.map(p => ({ SKU: p.sku, Name: p.name, Category: p.category, Units: p.stockQty, Price: p.price })),
      'vendor_low_stock_report.csv'
    );
  };

  return (
    <ConsoleLayout role="vendor" title="Reports & Financial Analytics (FR-33 to FR-35)">
      <div className="space-y-8">
        {/* Controls strip with Date Pickers and CSV Export */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" /> Date Filter:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 border rounded-lg bg-white dark:bg-slate-800"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 border rounded-lg bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExportStockCsv} className="flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export Low Stock CSV (FR-35)
            </Button>
            <Button size="sm" onClick={handleExportSalesCsv} className="flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export Sales CSV (FR-35)
            </Button>
          </div>
        </div>

        {/* KPIs Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Gross Merchandise Value</p>
            <p className="text-2xl font-extrabold text-primary mt-1">₹{(report?.grossSales || 184300).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Orders Fulfilled</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{report?.deliveredOrders || 12}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Low Stock SKUs (&lt; 40)</p>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">{lowStock.length}</p>
          </div>
        </div>

        {/* Sales by Category & Monthly Velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue by Product Category</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report?.salesByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="category" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
                  <Bar dataKey="sales" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Low-Stock Audit Ledger (Threshold 40)</h3>
            <div className="overflow-y-auto max-h-60 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {lowStock.map(p => (
                <div key={p.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                    <p className="text-slate-400 font-mono text-[11px]">SKU: {p.sku}</p>
                  </div>
                  <span className="font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded">
                    {p.stockQty} Units Left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
