import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public & Auth Pages
import { RoleChooser } from './pages/public/RoleChooser';
import { CustomerLogin } from './pages/auth/CustomerLogin';
import { CustomerRegister } from './pages/auth/CustomerRegister';
import { VendorLogin } from './pages/auth/VendorLogin';
import { AdminLogin } from './pages/auth/AdminLogin';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { ContactUs } from './pages/public/ContactUs';
import { AboutUs } from './pages/public/AboutUs';
import { Forbidden403 } from './pages/public/Forbidden403';
import { NotFound404 } from './pages/public/NotFound404';

// Customer Pages
import { Home } from './pages/customer/Home';
import { ProductListing } from './pages/customer/ProductListing';
import { CategoryPage } from './pages/customer/CategoryPage';
import { SearchResults } from './pages/customer/SearchResults';
import { ProductDetails } from './pages/customer/ProductDetails';
import { ShoppingCartPage } from './pages/customer/ShoppingCartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutAddress } from './pages/customer/CheckoutAddress';
import { CheckoutPayment } from './pages/customer/CheckoutPayment';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
import { MyOrders } from './pages/customer/MyOrders';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Vendor Pages
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { VendorProducts } from './pages/vendor/VendorProducts';
import { VendorInventory } from './pages/vendor/VendorInventory';
import { VendorOrders } from './pages/vendor/VendorOrders';
import { VendorShipments } from './pages/vendor/VendorShipments';
import { VendorDiscounts } from './pages/vendor/VendorDiscounts';
import { VendorReports } from './pages/vendor/VendorReports';
import { VendorProfile } from './pages/vendor/VendorProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminVendors } from './pages/admin/AdminVendors';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminAudit } from './pages/admin/AdminAudit';
import { AdminMessages } from './pages/admin/AdminMessages';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public & Auth Routes */}
      <Route path="/" element={<RoleChooser />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/register" element={<CustomerRegister />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/403" element={<Forbidden403 />} />

      {/* 2. Customer Storefront Routes */}
      <Route path="/store" element={<Home />} />
      <Route path="/products" element={<ProductListing />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout/address" element={<CheckoutAddress />} />
      <Route path="/checkout/payment" element={<CheckoutPayment />} />
      <Route path="/checkout/confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/profile" element={<CustomerProfile />} />

      {/* 3. Vendor (Distributor) Console Routes (Protected: role vendor) */}
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/products"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/inventory"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/orders"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/shipments"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorShipments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/discounts"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDiscounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/reports"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/profile"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProfile />
          </ProtectedRoute>
        }
      />

      {/* 4. Administrator Panel Routes (Protected: role admin) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCustomers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vendors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminVendors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCoupons />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAudit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMessages />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
export default App;
