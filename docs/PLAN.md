# BlueCart Online Shopping System (OSS) — Engineering Plan

**System:** BlueCart Online Shopping System (OSS) Prototype v1.0  
**Authors / Reference:** SRS v1.0 (Vishnu Teja Karampuri) & OSS Case Study Report  
**Implementation Stack:** React 18 + TypeScript + Vite + Tailwind CSS + HashRouter + Lucide Icons + Recharts + Vitest  

---

## 1. Actors & Roles

| Actor | Code Role | UI Designation | Scope & Permissions |
|---|---|---|---|
| **Customer** | `customer` | Customer | Browse catalog, search/filter, manage persistent cart, wishlist, checkout with 4-step wizard, pay via mock gateway, track orders, cancel/return orders within policy, submit verified reviews, profile & address management. |
| **Vendor (Distributor)** | `vendor` | Vendor (Distributor) | Owns catalog listings, updates price/stock, receives order requests, fulfills orders through state transitions (Confirmed → Processing → Shipped → Delivered), delivery history, configures time-bound product discounts, vendor sales and low-stock reports (CSV export). Subject to Admin approval upon creation. |
| **Administrator** | `admin` | Administrator | System-wide visibility and governance. Product management (add/edit/deactivate soft-delete), order management with logged overrides, customer account management (active/locked/suspended/unlock), vendor management (create/approve/deactivate), inventory threshold management & restock, coupon/promotions management, review moderation, reports with CSV export, immutable audit log. |

---

## 2. Requirements Baseline

### 2.1 Functional Requirements (FR-01 to FR-35)
- **FR-01**: Customer registration with email, name, phone, password.
- **FR-02**: User login with email/username and password.
- **FR-03**: Issue signed JWT access token (24-hour expiration).
- **FR-04**: Reject access to protected API endpoints without valid JWT (HTTP 401).
- **FR-05**: Role-Based Access Control (RBAC) rejecting unauthorized roles (HTTP 403).
- **FR-06**: Password reset workflow via time-limited verification link (15 minutes).
- **FR-07**: Account lockout for 15 minutes after 5 consecutive failed login attempts (HTTP 423).
- **FR-08**: Vendor/Admin product creation with mandatory attributes.
- **FR-09**: Automatic generation of unique SKU in `<CATEGORY3>-<4-digit>` format (e.g., `AUD-0001`).
- **FR-10**: Customer search and multi-facet filtering (category, price range, rating 4★/3★+, in-stock only) and sorting.
- **FR-11**: Automatic stock decrement upon successful checkout payment.
- **FR-12**: Vendor product updates (price, description, stock levels).
- **FR-13**: Admin soft-delete / deactivation of product listings, retaining historical orders.
- **FR-14**: Customer add product with quantity to persistent cart.
- **FR-15**: Modify quantities or remove items from cart.
- **FR-16**: Apply coupon code to cart and recalculate subtotal, discount, shipping, tax.
- **FR-17**: Prevent checkout if requested quantity exceeds available stock (re-validation).
- **FR-18**: Select shipping address and method (Standard ₹49, Express ₹149) during checkout.
- **FR-19**: Complete payment via integrated payment gateway mock (Card with Luhn, UPI, Netbanking, COD).
- **FR-20**: Generate unique sequential order ID (`ORD-2026-0043`) and confirmation on payment.
- **FR-21**: Vendor updates fulfillment status (Processing, Shipped, Delivered).
- **FR-22**: Customer real-time order status tracking and order history.
- **FR-23**: Customer cancellation before order is marked Shipped (restores inventory).
- **FR-24**: Customer return initiation within 7-day window after delivery.
- **FR-25**: Star rating (1–5) and review submission restricted to verified purchasers.
- **FR-26**: Automatic recalculation of product average rating and review count.
- **FR-27**: Admin moderation/removal of reviews with recalculation.
- **FR-28**: Admin coupon creation (percentage or flat, validity period, usage limits).
- **FR-29**: Rejection of expired or exhausted coupons at checkout with distinct feedback.
- **FR-30**: Vendor time-bound discounts on own listings.
- **FR-31**: Automated order confirmation notification.
- **FR-32**: Notification dispatch upon fulfillment status changes (respecting user preference).
- **FR-33**: Sales summary report generation filterable by date range and vendor.
- **FR-34**: Low-stock inventory report highlighting products below threshold (default 40).
- **FR-35**: CSV export of generated sales and inventory reports.

### 2.2 Non-Functional Requirements (NFR-01 to NFR-09)
- **NFR-01**: Simulated 200–500 ms async API latency; UI responds smoothly.
- **NFR-02**: Scalable data model supporting large catalog with client-side indexing and pagination.
- **NFR-03**: Checkout flow completing quickly and reliably.
- **NFR-04**: Password hashing simulated with bcrypt (cost factor ≥ 10, never plaintext in storage).
- **NFR-05**: TLS / HTTPS transport simulation (documented in Traceability).
- **NFR-06**: JWT token with 24-hour expiration stored in localStorage (Remember Me) or sessionStorage.
- **NFR-07**: User input sanitization (stripping HTML tags and NoSQL operators `$`).
- **NFR-08**: Zero raw card data persistence (PCI-DSS compliance banner and ephemeral handling).
- **NFR-09**: Immutable audit log for all administrative and vendor mutating actions.

---

## 3. Database Schema & Entities (`oss_db` / `bluecart_db_v1`)

1. **`users`**: `_id`, `name`, `email`, `mobile`, `passwordHash`, `role` (`customer`|`vendor`|`admin`), `status` (`Active`|`Locked`|`Suspended`|`Pending`), `failedAttempts`, `lockUntil`, `vendorId` (optional), `createdAt`.
2. **`vendors`**: `_id`, `name`, `contactEmail`, `phone`, `status` (`Approved`|`Pending`|`Suspended`), `commissionRate`, `createdAt`.
3. **`products`**: `_id`, `sku` (unique), `vendorId`, `name`, `description`, `category`, `brand`, `price`, `mrp`, `discountPercent`, `stockQty`, `images` (array of icon keys/illustrations), `isActive`, `deletedAt`, `avgRating`, `reviewCount`, `timeDiscount` (optional: `{percent, validFrom, validTo}`).
4. **`carts`**: `_id`, `userId`, `items: [{sku, qty}]`, `couponCode`, `updatedAt`.
5. **`orders`**: `_id`, `orderId` (e.g. `ORD-2026-0043`), `userId`, `items: [{sku, name, qty, unitPrice, vendorId}]`, `shippingAddress`, `billingAddress`, `shippingMethod`, `shippingCost`, `subtotal`, `couponDiscount`, `taxAmount`, `totalAmount`, `status` (`Confirmed`|`Processing`|`Shipped`|`Delivered`|`Return Requested`|`Returned`|`Cancelled`), `placedAt`, `updatedAt`, `statusTimeline: [{status, timestamp, note, changedBy}]`.
6. **`payments`**: `_id`, `orderId`, `gatewayRef`, `method` (`card`|`upi`|`netbanking`|`cod`), `amount`, `status` (`Paid`|`Failed`|`Refunded`), `paidAt`.
7. **`reviews`**: `_id`, `userId`, `userName`, `sku`, `rating` (1–5), `title`, `comment`, `createdAt`, `isActive`.
8. **`coupons`**: `_id`, `code` (unique uppercase), `type` (`percent`|`flat`), `value`, `validFrom`, `validTo`, `usageLimit`, `usedCount`, `isActive`.
9. **`audit_logs`**: `_id`, `actorId`, `actorName`, `actorRole`, `action`, `entity`, `entityId`, `before`, `after`, `timestamp`.
10. **`notifications`**: `_id`, `userId`, `title`, `message`, `type` (`order`|`status`|`alert`|`system`), `read`, `createdAt`.
11. **`contact_messages`**: `_id`, `name`, `email`, `subject`, `message`, `createdAt`, `status`.

---

## 4. Key Business Logic & Algorithms

### 4.1 Login & Lockout (Algorithm 6.4.1)
- Lookup user by email. If not found -> 401.
- If `lockUntil > Date.now()` -> 423 Locked with countdown.
- Verify bcrypt hash. If valid -> reset `failedAttempts = 0`, issue JWT token.
- If invalid -> increment `failedAttempts`. If reaches 5 -> set `lockUntil = Date.now() + 15 * 60 * 1000`. Return 401.

### 4.2 Server-side Pricing
- `subtotal = sum(item.price * item.qty)`
- `couponDiscount = applyCoupon(subtotal, code)`
- `discountedSubtotal = subtotal - couponDiscount`
- `taxAmount = round(discountedSubtotal * 0.18)` (GST 18%)
- `shippingCost = shippingMethod === 'express' ? 149 : 49` (free standard if subtotal >= 5000)
- `grandTotal = discountedSubtotal + taxAmount + shippingCost`

### 4.3 Atomic Checkout (Algorithm 6.4.2)
1. Verify stock for each cart item (`product.stockQty >= item.qty`). If any insufficient, return 400 error.
2. Calculate verified server-side total.
3. Process payment gateway session. If failed toggle active -> return 402/failed; cart and stock unchanged.
4. On success:
   - Decrement product stock: `product.stockQty -= item.qty`.
   - Create order with status `Confirmed` and sequence ID (`ORD-2026-XXXX`).
   - Create payment ledger record (`Paid`).
   - Clear customer cart.
   - If coupon used, increment coupon `usedCount`.
   - Create order notification (`FR-31`).
   - Append audit log entry.

### 4.4 Order State Machine (Table 5.4)
- `Confirmed` -> `Processing` (Vendor) or `Cancelled` (Customer/Admin).
- `Processing` -> `Shipped` (Vendor) or `Cancelled` (Customer/Admin).
- `Shipped` -> `Delivered` (Vendor). Cancel is disallowed once Shipped.
- `Delivered` -> `Return Requested` (Customer, only if within 7-day delivery window).
- `Return Requested` -> `Returned` (Vendor/Admin) or `Delivered` (rejected return).
- `Cancelled` is terminal. Cancellation restores stock and marks payment Refunded.

### 4.5 Verified Reviews & Rating Aggregation (Algorithm 6.4.3)
- Customer can only review product if they have an order containing the SKU with status `Delivered`.
- 1 review per product per customer.
- Rating calculation: updates `avgRating` and `reviewCount`.

---

## 5. Screen Inventory (All 42 Screens)

### 5.1 Public / Authentication (8 Screens)
1. **Landing & Role Chooser (`/`)**: 3 role entry cards, hero, feature highlights.
2. **Customer Login (`/login`)**: Email/password, visibility toggle, remember me, demo quick-fill, inline validation, lockout alert.
3. **Customer Registration (`/register`)**: First/last name, email, phone (+91), password, strength meter.
4. **Vendor Login (`/vendor/login`)**: Vendor console sign-in with quick-fill.
5. **Admin Login (`/admin/login`)**: Admin security banner, lockout warnings, audit notice, quick-fill.
6. **Forgot Password (`/forgot-password`)**: Email submission, simulated email modal/toast with 15-min link.
7. **Reset Password (`/reset-password`)**: Token check, expiration demonstration, new password entry.
8. **Contact Us (`/contact`) & About Us (`/about`)**: Contact form (saves message), team/stats overview.

### 5.2 Customer Storefront (13 Screens)
9. **Storefront Home (`/store`)**: Festive sale banner, category grid, featured products.
10. **Product Listing (`/products`)**: Filter sidebar (categories, price, rating, availability), sort, pagination.
11. **Category Page (`/category/:category`)**: Department header, category-specific filters, product cards.
12. **Search Results (`/search`)**: Query highlight, matching badges, active filter chips.
13. **Product Details (`/product/:id`)**: Gallery with 4 thumbnails, price/MRP/discount, SKU, stock pill, vendor, quantity stepper, Add to Cart, Buy Now, Wishlist toggle, tabs (Description, Specs, Reviews).
14. **Ratings & Reviews View & Modal (`/product/:id/reviews`)**: Star distribution breakdown, list of verified reviews, verified purchase review form.
15. **Shopping Cart (`/cart`)**: Line items, quantity steppers, move to wishlist, coupon input with feedback, order summary.
16. **Wishlist (`/wishlist`)**: Saved items, direct add to cart, remove.
17. **Checkout Step 1: Address (`/checkout/address`)**: Address selector or form (+91 phone, PIN code), billing address toggle.
18. **Checkout Step 2: Shipping & Review (`/checkout/shipping`)**: Standard ₹49 vs Express ₹149, item summary.
19. **Checkout Step 3: Secure Payment (`/checkout/payment`)**: Card (Luhn + CVV + expiry), UPI, Netbanking, COD, PCI-DSS notice, "Simulate failed payment" toggle.
20. **Order Confirmation (`/checkout/confirmation/:orderId`)**: Success banner, order ID, delivery estimate, status timeline, email simulation modal.
21. **My Orders (`/orders`)**: Tabs (All, Active, Delivered, Cancelled), actions (Cancel, Track, Return, Reorder, Review).
22. **Track Order Detail Modal / Page (`/orders/:orderId`)**: 4-point visual timeline, full item breakdown, delivery address, invoice summary.
23. **Customer Profile (`/profile`)**: Personal info, saved addresses (CRUD), change password, notification preference switches.
24. **Notification Centre (Header Dropdown/Drawer)**: In-app real-time alerts, mark all as read.

### 5.3 Vendor (Distributor) Console (8 Screens)
25. **Vendor Dashboard (`/vendor/dashboard`)**: KPIs (To Fulfil, Shipped this week, Active listings, Earnings), orders to fulfil table with row status updater, earnings chart, low-stock warnings.
26. **Assigned Products / My Products (`/vendor/products`)**: Filterable table, stock pills, Add Product modal with auto SKU generator (`CAT-0001`), edit price/stock/description.
27. **Inventory & Stock Updates (`/vendor/inventory`)**: Stock level visual bars, quick +/- stepper, restock logger, low-stock alert thresholds.
28. **Order Requests (`/vendor/orders`)**: Status tabs, Accept Order action, compliant state transition selector.
29. **Shipments & Deliveries (`/vendor/shipments`)**: 3-column Kanban board (Processing / Shipped / Delivered) and Delivery History table with date range.
30. **Vendor Promotions / Discounts (`/vendor/discounts`)**: Time-bound discount configuration on vendor's own listings.
31. **Vendor Reports & Analytics (`/vendor/reports`)**: Date-range sales summary, low stock breakdown, CSV export.
32. **Vendor Profile (`/vendor/profile`)**: Store info, phone, change password, logout.

### 5.4 Administrator Panel (10 Screens)
33. **Admin Dashboard (`/admin/dashboard`)**: Platform KPIs (Gross sales, Orders, Customers, Products, Inventory value), 7-day sales bar chart, recent orders table, low-stock alerts.
34. **Product Management (`/admin/products`)**: Search, filter, add/edit product, soft-delete deactivation with confirm dialog, reactivation.
35. **Order Management (`/admin/orders`)**: Live-count tabs, detailed order modal, logged Admin Override action with mandatory reason.
36. **Customer Management (`/admin/customers`)**: Table with status pills (Active, Locked, Suspended), order history modal, Unlock/Suspend/Reactivate actions.
37. **Vendor Management (`/admin/vendors`)**: Vendor list, Create Vendor action, Approve/Reject pending vendors, suspend/reactivate.
38. **Inventory Management (`/admin/inventory`)**: Configurable low-stock threshold (default 40), level bars, Restock modal, CSV export.
39. **Coupons & Promotions (`/admin/coupons`)**: Table with code, discount, validity, usage limit/used count, New Coupon modal, disable toggle.
40. **Review Moderation (`/admin/reviews`)**: Moderation queue, Remove Review action with mandatory reason, auto recalculation of product score.
41. **Payments Ledger (`/admin/payments`)**: Gateway reference table, method, status, amount, export.
42. **Reports & Analytics (`/admin/reports`)**: Monthly sales chart, category pie chart, sales-by-category table, date & vendor filters, CSV export.
43. **System Audit Log (`/admin/audit`)**: Append-only log table (actor, role, action, entity, before/after JSON diff, timestamp).
44. **Admin Notifications & Contact Messages (`/admin/messages`)**: Inbound contact form submissions, low-stock alerts, pending vendor approval alerts.

---

## 6. Implementation Milestones

1. **Phase 1: Project Scaffolding & Dependencies**
   - Initialize Vite + React + TypeScript + Tailwind CSS + Lucide icons + Recharts + Vitest.
   - Configure Tailwind with report design tokens (Primary `#2563EB`, Navy `#0F1B3D`, pastel backgrounds, status colors).
2. **Phase 2: Mock Database, Seed Data & REST API Layer**
   - Implement `bluecart_db_v1` in `localStorage` with versioning and reset capability.
   - Seed ~42 products matching report (Aurora ₹3,499, PulseFit ₹5,999, StrideX ₹2,799, Nova ₹17,999, AeroBook ₹52,990, Trekker ₹1,499, SnapPro ₹38,500, Polar ₹999).
   - Seed 12+ customers, 40+ orders with timeline, 4 coupons, 60+ reviews, audit logs, notifications.
   - Implement `src/api/` with simulated latency (200–500ms) and proper HTTP status codes.
3. **Phase 3: Core Services & Unit Testing**
   - Implement auth with lockout algorithm, server pricing, coupon validation, checkout state machine, review recalculation, input sanitization.
   - Write Vitest tests matching TC-09, TC-13, TC-14, TC-15, TC-17, TC-20, TC-21, TC-22, TC-25, TC-30.
4. **Phase 4: Storefront & Customer Experience**
   - Design Storefront shell with top bar, search, cart badge, category nav.
   - Build Home, Listing, Details, Reviews, Cart, 4-step Checkout, Order confirmation, My Orders, Track modal, Profile.
5. **Phase 5: Vendor Console**
   - Design navy sidebar layout for Vendor (Distributor).
   - Build Dashboard, Assigned Products (with auto SKU), Stock Updates, Order Requests, Shipments board, Discounts, Reports with CSV export.
6. **Phase 6: Admin Panel**
   - Build Dashboard, Product management (with soft-delete), Order management (with override), Customer management, Vendor approvals, Inventory threshold, Coupons, Review moderation, Audit log, Reports.
7. **Phase 7: End-to-End Verification & Documentation**
   - Run Vitest tests.
   - Run browser agent testing at 1440px and 390px, save screenshots to `docs/screens/`.
   - Generate `docs/TRACEABILITY.md`, `docs/TESTING.md`, `README.md`.
