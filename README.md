# BlueCart Online Shopping System (OSS) — Prototype v1.0

> **A production-grade, role-based e-commerce platform prototype** built strictly according to the IEEE Software Requirements Specification (SRS v1.0) and Case Study Report with 26 UI references.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-39%20passed%20(100%25)-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)]()

---

## 1. Quick Start

### Prerequisites
- **Node.js** v18+ (tested on Node v20+)
- **npm** v9+

### Installation & Run
```bash
# 1. Install all dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run automated test suite (39 Vitest tests)
npm test

# 4. Compile production build
npm run build
```

The application runs using **HashRouter** (`/#/`), making it completely portable across static web servers, preview environments, and local file access without route fallback issues.

---

## 2. Actors & Demo Credentials

BlueCart features **three distinct actors** with dedicated role isolation, protected routes, and distinct console navigation shells:

| Actor Role | UI Navigation Label | Demo Account | Email | Password | Access Path |
|---|---|---|---|---|---|
| **Customer** | Customer | Ananya Sharma | `ananya@example.com` | `Customer@123` | `#/` or `#/login` |
| **Vendor (Distributor)** | Vendor (Distributor) | Vikram Mehta (Apex) | `vikram@apextech.in` | `Vendor@123` | `#/vendor/login` |
| **Administrator** | Admin | Rajesh Kumar | `admin@bluecart.in` | `Admin@123` | `#/admin/login` |

> 💡 **One-Click Quick Login:** Every login page features a `"Quick Login"` helper button that instantly populates credentials and logs in the demo persona.

---

## 3. Tech Stack & System Architecture

```
src/
├── api/            # Mock async REST API with simulated 200–500ms latency & HTTP status codes
│   ├── auth.api.ts         # User auth, registration, lockout, profile
│   ├── products.api.ts     # Catalog CRUD, SKU generation, soft-deactivate
│   ├── cart.api.ts         # Cart persistence per user
│   ├── checkout.api.ts     # Atomic commit, pre-validation, stock decrements
│   ├── orders.api.ts       # State machine transitions, cancellation, returns
│   ├── reviews.api.ts      # Verified buyer check, moderation
│   ├── coupons.api.ts      # Promotional campaigns, usage limits
│   ├── reports.api.ts      # Revenue aggregation, top sellers
│   ├── users.api.ts        # Customer management, unlock accounts
│   ├── vendors.api.ts      # Distributor registration & approvals
│   └── audit.api.ts        # Immutable audit trail queries
├── db/             # Seed database & localStorage engine (bluecart_db_v1)
│   ├── seedData.ts         # 42 realistic products, 40+ orders, 12 users, coupons, reviews
│   └── localStorageDb.ts   # Thread-safe local storage persistence with in-memory fallback
├── services/       # Core business logic & algorithms
│   ├── auth.service.ts     # Algorithm 6.4.1: Lockout after 5 failed attempts
│   ├── pricing.service.ts  # Algorithm 6.4.2: Subtotal, 18% GST, shipping thresholds
│   ├── coupon.service.ts   # Algorithm 6.4.3: Coupon discount engine & limit checks
│   ├── orderStateMachine.ts # Table 5.4: Permitted state transitions & 7-day return
│   ├── rating.service.ts   # Algorithm 6.4.3: Rating recalculation (1 decimal place)
│   ├── sanitizer.service.ts # NFR-07: XSS and NoSQL injection sanitizer
│   ├── sku.service.ts      # Unique SKU generator (BC-[CAT]-2026-[SEQ])
│   └── audit.service.ts    # Append-only audit logger
├── context/        # React contexts (Auth, Cart, Wishlist, Toast, Theme, Notifications)
├── components/     # UI design system & responsive layout shells
│   ├── ui/         # Button, Input, Modal, ConfirmDialog, Badge, Stepper, Breadcrumbs, etc.
│   └── layout/     # StoreLayout (storefront), ConsoleLayout (vendor/admin navy shell)
├── pages/          # 42 fully implemented screens
│   ├── public/     # RoleChooser, ContactUs, AboutUs, 403, 404
│   ├── auth/       # Customer/Vendor/Admin Login, Register, Forgot/Reset Password
│   ├── customer/   # Home, Listing, Details, Cart, Wishlist, 4-step Checkout, Orders
│   ├── vendor/     # Dashboard, Products, Inventory, Orders, Shipments, Discounts, Reports
│   └── admin/      # Dashboard, Products, Orders, Customers, Vendors, Coupons, Audit, etc.
└── tests/          # Automated Vitest test suites (TC-09, TC-13, TC-14, TC-15, TC-17, TC-20, etc.)
```

---

## 4. Key Features & Algorithms

### 4.1 Account Lockout Security (Algorithm 6.4.1, FR-07)
- 5 consecutive invalid login attempts automatically trigger a **15-minute account lockout**.
- Login form returns HTTP 423 status code and displays a live countdown timer (`mm:ss`).
- Administrators can view and immediately unlock locked accounts via `#/admin/customers`.

### 4.2 Atomic Checkout & Stock Decrement (Algorithm 6.4.2, FR-11, FR-17, FR-20)
- Performs authoritative server-side inventory re-validation before committing transaction.
- Calculates subtotal, coupon discounts, 18% GST, and shipping (standard ₹49 / free for orders ≥ ₹5,000; express ₹149).
- Generates sequential order numbers (e.g. `ORD-2026-0043`).
- **Simulate Failed Payment Toggle (TC-17):** Available on checkout to demonstrate error recovery; stock is never deducted and no orphan order is placed.

### 4.3 Order Fulfillment State Machine (Table 5.4, FR-21, FR-23, FR-24)
- **Legal Flow:** `Confirmed` → `Processing` → `Shipped` → `Delivered`.
- **Cancellation:** Customers can cancel orders in `Confirmed` or `Processing` status; cancellation is strictly forbidden after shipment.
- **7-Day Return Policy:** Customers can request returns only within 7 days of delivery timestamp.
- **Administrative Override:** Administrators can manually adjust any order status with mandatory audit log justification.

### 4.4 Verified Buyer Reviews (Algorithm 6.4.3, FR-25, FR-26)
- Review submission forms are strictly enabled for customers who have a `Delivered` order containing that product SKU.
- Submissions dynamically recalculate the product's average star rating and review count to 1 decimal place.

### 4.5 Design Language & Tokens (Report Table 6.3)
- **Primary Blue:** `#2563EB`
- **Console Navy:** `#0F1B3D`
- **Currency:** Indian Rupee (`₹`), formatted with `en-IN` standards.
- **Product Tiles:** High-fidelity inline SVG illustrations and badge indicators (no external broken image URLs).
- **Responsive:** Full mobile collapse, drawer navigation, and fluid desktop data tables (360px to 1920px).

---

## 5. Documentation Deliverables

Detailed engineering documentation is located in the `docs/` folder:

- [`docs/PLAN.md`](docs/PLAN.md) — Comprehensive architecture plan, requirements breakdown, and screen inventory.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — Architectural decision log resolving ambiguities following **SRS > Report > Engineering Judgment**.
- [`docs/TRACEABILITY.md`](docs/TRACEABILITY.md) — Requirements Traceability Matrix linking all 35 Functional Requirements and 9 NFRs to files and test cases.
- [`docs/TESTING.md`](docs/TESTING.md) — Test execution report with automated Vitest test output and manual test scenarios.
