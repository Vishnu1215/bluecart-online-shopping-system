# Architecture & Engineering Decisions Log (DECISIONS.md)

**System:** BlueCart Online Shopping System (OSS) Prototype  
**Precedence Order:** SRS v1.0 > Report > Engineering Judgment  

---

### Decision 01: Actor Alignment — Vendor vs Distributor
- **Context:** The prompt notes that the SRS defines "Vendor/Seller" while the brief calls this role "Distributor".
- **Source:** Prompt Section 1 & SRS 2.3.
- **Decision:** The role is treated as one and the same. The UI label is `"Vendor (Distributor)"` in the role chooser, login forms, and console sidebar/header. The internal code role is `role: "vendor"`. Features are mapped to SRS vendor capabilities (assigned catalogue, stock updates, fulfilling orders containing their products, delivery history). Third-party courier/fleet tracking is strictly out of scope per SRS 1.4 / TBD-05.

### Decision 02: Mock Backend & Storage Architecture
- **Context:** The system must run completely locally without an external backend server while preserving full REST semantics and persistent state across page reloads.
- **Source:** Report Table 5.1 & Table 5.3; Prompt Section 2.
- **Decision:** Built an asynchronous mock API layer in `src/api/` that mimics REST HTTP calls, enforces 200–500ms simulated latency, throws standard HTTP-style errors (400, 401, 403, 404, 423), and persists all collections to `localStorage` under the versioned key `bluecart_db_v1`. A global "Reset Demo Data" utility is provided to reset the state back to the original seed data anytime.

### Decision 03: Password Hashing in a Browser Prototype
- **Context:** NFR-04 requires passwords to be hashed using bcrypt with cost factor >= 10. Raw passwords must never be stored in plaintext.
- **Source:** SRS NFR-04.
- **Decision:** Utilized `bcryptjs` in the browser client to hash passwords during customer registration and seed generation with salt rounds = 10. `passwordHash` is stored in the mock database and validated using `bcrypt.compareSync`.

### Decision 04: JWT Simulation & Expiry Handling
- **Context:** FR-03 & NFR-06 specify signed JWT access tokens with a 24-hour expiration.
- **Source:** SRS FR-03, NFR-06; Report Algorithm 6.4.1.
- **Decision:** Implemented a base64url signed JWT simulator (`src/services/jwt-sim.ts`) with header, payload (including `userId`, `role`, `email`, `exp`, `iat`), and HMAC-SHA256 signature simulation. Token is persisted in `localStorage` if "Remember Me" is checked, or `sessionStorage` otherwise. The API interceptor inspects token expiry, returning 401 if expired.

### Decision 05: Account Lockout Mechanism
- **Context:** FR-07 requires account lockout for 15 minutes after 5 consecutive failed login attempts.
- **Source:** SRS FR-07; Report Algorithm 6.4.1.
- **Decision:** Stored `failedAttempts` and `lockUntil` timestamp on each user record. When `lockUntil > Date.now()`, the API responds with HTTP 423 (Locked) and the exact remaining minutes/seconds. The UI shows an active countdown timer. Successful login resets `failedAttempts` to 0.

### Decision 06: Server-side Pricing Authority
- **Context:** Client-side price tampering must be prevented; all line items, tax, shipping, and coupons must be calculated on the backend.
- **Source:** SRS 5.5 Business Rules, Report Algorithm 6.4.2.
- **Decision:** The checkout endpoint and cart service ignore any client-submitted totals and compute subtotal, coupon discount, GST (18% on discounted subtotal), and shipping charges directly from database product records.

### Decision 07: Product Visual Assets & No External URLs
- **Context:** Prompt Section 3 specifies: "Product images: no external image URLs. Use inline SVG/emoji icon tiles on pastel backgrounds (like the screenshots) or generated SVG illustrations. The gallery uses 4 thumbnails (main, detail, battery/feature, box)."
- **Source:** Prompt Section 3.
- **Decision:** Built an SVG/vector illustration generator and catalog icon mapper (`src/components/ui/ProductImage.tsx`) that renders high-fidelity pastel product tiles matching Figures 8.3–8.7, complete with 4 thumbnail perspectives for the product gallery.

### Decision 08: Verified Purchaser Review Rule
- **Context:** FR-25 states that only customers who purchased a product can submit a review.
- **Source:** SRS FR-25; Prompt Section 4.2.
- **Decision:** When viewing the review form or clicking "Write a review", the system checks whether the authenticated user has an order containing the product's SKU with status `Delivered`. If not verified, the form is disabled with the notice: *"Only customers who purchased this product can submit a review."*

### Decision 09: Return Policy Window
- **Context:** FR-24 requires returns to be initiated within a configurable return window.
- **Source:** SRS FR-24; Report Table 5.4.
- **Decision:** Set a standard configurable 7-day return window from `order.deliveredAt`. If within 7 days, the Return button opens a reason modal and transitions to `Return Requested`. If outside 7 days, the button is disabled with an explanatory tooltip.

### Decision 10: Soft Delete & Audit Logging
- **Context:** FR-13 and SRS 5.2 specify soft-delete for products, retaining past order history and audit trail.
- **Source:** SRS FR-13, NFR-09; Report Table 5.3.
- **Decision:** Deactivated products and users set `isActive: false` and `deletedAt: timestamp`. They are filtered out of public storefront queries but remain accessible in admin management tables with a 30-day recovery badge. Every mutating action by Admin or Vendor automatically writes to an immutable `audit_logs` collection.
