# BlueCart Online Shopping System (OSS) — Requirements Traceability Matrix (RTM)

This document provides end-to-end traceability between the IEEE-compliant Software Requirements Specification (SRS v1.0), Case Study Report, UI screens, service implementations, mock REST endpoints, and test suites.

---

## 1. Functional Requirements Traceability (FR-01 to FR-35)

| Req ID | Requirement Description | SRS Ref | UI Screen / Route | Implementation File(s) | REST API / Service | Test Case | Status |
|---|---|---|---|---|---|---|---|
| **FR-01** | User Registration with validation (+91 mobile, strong password) | §3.2.1 | `#/register` | `src/pages/auth/CustomerRegister.tsx` | `authApi.register` | Form Validation Check | **VERIFIED** |
| **FR-02** | User Authentication (Customer, Vendor, Admin) | §3.2.1 | `#/login`, `#/vendor/login`, `#/admin/login` | `src/pages/auth/*Login.tsx` | `authApi.login`, `processLogin()` | TC-30 | **VERIFIED** |
| **FR-03** | Password Reset via time-limited link (15m expiry) | §3.2.1 | `#/forgot-password`, `#/reset-password` | `src/pages/auth/ForgotPassword.tsx`, `ResetPassword.tsx` | `authApi.requestPasswordReset`, `resetPassword` | Token Expiry Check | **VERIFIED** |
| **FR-04** | Session Management & Token Simulation | §3.2.1 | All Protected Routes | `src/context/AuthContext.tsx`, `ProtectedRoute.tsx` | `src/services/jwt-sim.ts` | Session Invalidation | **VERIFIED** |
| **FR-05** | Role-Based Access Control (RBAC) & 403 Forbidden | §3.2.1 | `#/403` | `src/components/layout/ProtectedRoute.tsx`, `Forbidden403.tsx` | `src/middleware/rbacGuard.ts` | Guard Isolation | **VERIFIED** |
| **FR-06** | Profile Management & Notification Preferences | §3.2.1 | `#/profile` | `src/pages/customer/CustomerProfile.tsx` | `usersApi.updateProfile`, `updatePreferences` | Profile Persistence | **VERIFIED** |
| **FR-07** | Account Lockout after 5 consecutive failures (15m) | §3.2.1 | `#/login`, `#/admin/login` | `src/services/auth.service.ts` | `processLogin()`, HTTP 423 | TC-30 (`authLockout.test.ts`) | **VERIFIED** |
| **FR-08** | Product Catalog Management (Vendor) | §3.2.2 | `#/vendor/products` | `src/pages/vendor/VendorProducts.tsx` | `productsApi.createProduct`, `updateProduct` | Catalog Mutation | **VERIFIED** |
| **FR-09** | Unique SKU Generation (e.g. `BC-MOB-2026-XXXX`) | §3.2.2 | `#/vendor/products`, `#/admin/products` | `src/services/sku.service.ts` | `generateUniqueSku()` | SKU Uniqueness | **VERIFIED** |
| **FR-10** | Low-Stock Threshold Alerts (< 40 units default) | §3.2.2 | `#/vendor/inventory`, `#/admin/inventory` | `src/pages/vendor/VendorInventory.tsx` | `productsApi.getLowStockProducts` | Stock Threshold | **VERIFIED** |
| **FR-11** | Automatic Inventory Decrement on Order Placement | §3.2.2 | `#/checkout/payment` | `src/api/checkout.api.ts` | `checkoutApi.processCheckout` | Algorithm 6.4.2 | **VERIFIED** |
| **FR-12** | Manual Inventory Adjustment with Audit Note | §3.2.2 | `#/vendor/inventory` | `src/pages/vendor/VendorInventory.tsx` | `productsApi.adjustStock` | Audit Trail Check | **VERIFIED** |
| **FR-13** | Product Soft-Delete / Deactivation | §3.2.2 | `#/admin/products` | `src/pages/admin/AdminProducts.tsx` | `productsApi.deactivateProduct` | Soft-delete Fidelity | **VERIFIED** |
| **FR-14** | Shopping Cart Add / Update / Remove / Clear | §3.2.3 | `#/cart` | `src/pages/customer/ShoppingCartPage.tsx` | `src/context/CartContext.tsx`, `cartApi` | Cart Persistence | **VERIFIED** |
| **FR-15** | Cart-to-Wishlist Migration & Wishlist Management | §3.2.3 | `#/wishlist`, `#/cart` | `src/pages/customer/WishlistPage.tsx` | `src/context/WishlistContext.tsx` | Wishlist Toggle | **VERIFIED** |
| **FR-16** | Promotional Coupon Validation in Cart | §3.2.3 | `#/cart` | `src/services/coupon.service.ts` | `validateAndApplyCoupon()` | TC-14, TC-15 | **VERIFIED** |
| **FR-17** | Pre-Checkout Inventory Re-Validation | §3.2.4 | `#/checkout/payment` | `src/api/checkout.api.ts` | `checkoutApi.validateStock` | Stock Boundary Check | **VERIFIED** |
| **FR-18** | Multi-Step Checkout Flow (Address, Shipping, Pay) | §3.2.4 | `#/checkout/address`, `#/checkout/payment` | `src/pages/customer/CheckoutAddress.tsx`, `CheckoutPayment.tsx` | `src/components/ui/Stepper.tsx` | 4-step Stepper | **VERIFIED** |
| **FR-19** | Mock Payment Gateway (Card, UPI, NetBanking, COD) | §3.2.4 | `#/checkout/payment` | `src/pages/customer/CheckoutPayment.tsx` | Luhn Check, Gateway Mock | TC-17 | **VERIFIED** |
| **FR-20** | Atomic Order Creation & Sequential ID (`ORD-2026-XXXX`) | §3.2.4 | `#/checkout/confirmation/:id` | `src/pages/customer/OrderConfirmation.tsx` | `checkoutApi.processCheckout` | Sequential ID Check | **VERIFIED** |
| **FR-21** | Order Status State Machine (Confirmed -> Processing -> Shipped -> Delivered) | §3.2.5 | `#/vendor/orders`, `#/admin/orders` | `src/services/orderStateMachine.ts` | `validateOrderTransition()` | TC-20 | **VERIFIED** |
| **FR-22** | Customer Order History & Filtering (All, Active, Delivered, Cancelled) | §3.2.5 | `#/orders` | `src/pages/customer/MyOrders.tsx` | `ordersApi.getOrders` | Filter Tabs | **VERIFIED** |
| **FR-23** | Customer Order Cancellation before Shipped | §3.2.5 | `#/orders` | `src/pages/customer/MyOrders.tsx` | `ordersApi.cancelOrder` | TC-21 | **VERIFIED** |
| **FR-24** | 7-Day Return Window Policy | §3.2.5 | `#/orders` | `src/services/orderStateMachine.ts` | `isOrderInsideReturnWindow()` | TC-22 | **VERIFIED** |
| **FR-25** | Verified Purchaser Review Eligibility | §3.2.6 | `#/products/:id` | `src/api/reviews.api.ts` | `reviewsApi.checkEligibility` | Delivered Order Check | **VERIFIED** |
| **FR-26** | Incremental Rating Recalculation (1 decimal place) | §3.2.6 | `#/products/:id` | `src/services/rating.service.ts` | `calculateNewRating()` | TC-25 (Algorithm 6.4.3) | **VERIFIED** |
| **FR-27** | Review Moderation / Soft-Delete by Admin | §3.2.6 | `#/admin/reviews` | `src/pages/admin/AdminReviews.tsx` | `reviewsApi.removeReview` | Rating Recalc on Mod | **VERIFIED** |
| **FR-28** | Admin Coupon Campaign Management | §3.2.7 | `#/admin/coupons` | `src/pages/admin/AdminCoupons.tsx` | `couponsApi.createCoupon`, `toggleCouponActive` | Campaign Rules | **VERIFIED** |
| **FR-29** | Vendor Time-Limited Product Discounts | §3.2.7 | `#/vendor/discounts` | `src/pages/vendor/VendorDiscounts.tsx` | `productsApi.applyTimeDiscount` | Discount Automation | **VERIFIED** |
| **FR-30** | Sales Reports & Analytics (Revenue, Units, Top Sellers) | §3.2.8 | `#/vendor/reports`, `#/admin/reports` | `src/pages/vendor/VendorReports.tsx`, `AdminReports.tsx` | `reportsApi.getSalesReport` | Recharts Visuals | **VERIFIED** |
| **FR-31** | Multi-Channel In-App Notification Center | §3.2.9 | Header Bell Dropdown | `src/context/NotificationContext.tsx` | `notificationsApi` | Live Unread Count | **VERIFIED** |
| **FR-32** | Automated Status Notifications to Customers | §3.2.9 | Storefront Bell & Orders | `src/api/orders.api.ts` | `createNotification()` | Dispatch Event | **VERIFIED** |
| **FR-33** | Full-Text Product Search with Category & Price Filters | §3.2.10 | `#/search`, `#/products` | `src/pages/customer/SearchResults.tsx`, `ProductListing.tsx` | `productsApi.getProducts` | Search & Range Filter | **VERIFIED** |
| **FR-34** | Category-Filtered Browsing & Breadcrumbs | §3.2.10 | `#/category/:cat` | `src/pages/customer/CategoryPage.tsx` | Category Grid & Breadcrumbs | Navigation Trail | **VERIFIED** |
| **FR-35** | Responsive Design (360px Mobile to 1920px Desktop) | §3.2.10 | All 42 Screens | `StoreLayout.tsx`, `ConsoleLayout.tsx`, Tailwind classes | Mobile Drawer, Fluid Grids | Viewport Testing | **VERIFIED** |

---

## 2. Non-Functional Requirements Traceability (NFR-01 to NFR-09)

| NFR ID | Requirement Description | SRS Ref | Implementation | Verification Method | Status |
|---|---|---|---|---|---|
| **NFR-01** | Simulated Latency (200–500 ms) | §4.1 | `src/api/mockClient.ts` | `simulateLatency(200, 500)` in every API route | **VERIFIED** |
| **NFR-02** | High Availability & Fallback Mode | §4.2 | `src/db/localStorageDb.ts` | In-memory fallback if localStorage is blocked | **VERIFIED** |
| **NFR-03** | LocalStorage Persistence & Schema Migration | §4.3 | `src/db/localStorageDb.ts` | Versioned schema key `bluecart_db_v1` with reset action | **VERIFIED** |
| **NFR-04** | Secure Password Hashing (bcrypt) | §4.4 | `src/services/auth.service.ts` | `bcrypt.hashSync`, `bcrypt.compareSync` (8 salt rounds) | **VERIFIED** |
| **NFR-05** | Role-Based Access Control (RBAC) Guard | §4.5 | `src/components/layout/ProtectedRoute.tsx` | Strict actor isolation: Customer, Vendor, Admin | **VERIFIED** |
| **NFR-06** | Simulated JWT Tokens | §4.6 | `src/services/jwt-sim.ts` | Base64 URL-encoded header.payload.signature simulation | **VERIFIED** |
| **NFR-07** | Input Sanitization (XSS & NoSQL defense) | §4.7 | `src/services/sanitizer.service.ts` | Tag stripping & key inspection (`sanitizer.test.ts`) | **VERIFIED** |
| **NFR-08** | Payment Gateway PCI-DSS Simulation Rule | §4.8 | `src/api/checkout.api.ts` | Raw card data never persisted; only `cardLast4` stored | **VERIFIED** |
| **NFR-09** | Immutable Audit Trail Logging | §4.9 | `src/services/audit.service.ts`, `#/admin/audit` | Append-only audit logs with actor, entity, before/after | **VERIFIED** |

---

## 3. Actor-to-Feature Matrix

| Feature Module | Customer | Vendor (Distributor) | Administrator |
|---|---|---|---|
| **Storefront Browsing & Search** | Full Access | Full Access | Full Access |
| **Cart & Wishlist** | Full Access | Full Access | Full Access |
| **Checkout & Simulated Payment** | Full Access | Forbidden | Forbidden |
| **My Orders & 7-Day Returns** | Self Orders Only | Self Fulfilment Only | All Orders (Override) |
| **Product & SKU Catalog** | Read Only | Own Products (CRUD) | System Products (CRUD/Deactivate) |
| **Inventory Stock Management** | View Stock Count | Own Stock (Edit/Audit) | Global Stock (Edit/Audit) |
| **Order Fulfilment Workflow** | Cancel Before Ship | Processing -> Shipped -> Delivered | Full Override with Audit Note |
| **Coupons & Campaigns** | Apply at Checkout | Time-Discount On Products | Create / Toggle Campaigns |
| **Distributor / Vendor Management**| N/A | Register & Profile Edit | Approve / Suspend / Edit Rate |
| **System Audit Trail** | N/A | N/A | View Full Immutable Logs |
| **Inquiries & Contact Inbox** | Submit Form | N/A | Read & Resolve Inquiries |
