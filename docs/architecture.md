# Architecture

## System Overview

```
client/  (React + Vite, port 5173)
    └─ talks to ──► server/  (Express + Node.js, port 5000)
                         └─ talks to ──► MySQL (via Prisma)
                         └─ talks to ──► Cloudinary (images)
                         └─ talks to ──► Stripe (payments)
```

Client and server are **independent apps** in separate directories. They share no code. All communication is via HTTP to `http://localhost:5000/api`.

---

## Backend (`server/`)

### Entry point: `server.js`
- Auto-loads every file in `routes/` with `readdirSync('./routes')` and mounts all under `/api`
- Adding a new route file is enough — no manual registration needed

### Route → Controller pattern
```
routes/auth.js        → controllers/auth.js
routes/user.js        → controllers/user.js
routes/products.js    → controllers/products.js
routes/category.js    → controllers/category.js
routes/admin.js       → controllers/admin.js
routes/Stripe.js      → controllers/Stripe.js
```

### Middlewares (`middlewares/authCheck.js`)
Two guards used directly in route definitions:
- `authCheck` — verifies JWT from `Authorization: Bearer <token>` header, attaches decoded payload to `req.user`, also checks `user.enabled === true`
- `adminCheck` — runs after `authCheck`, queries DB again and rejects if `role !== 'admin'`

### Database: Prisma + MySQL
Schema at `server/prisma/schema.prisma`. Prisma client singleton in `server/config/prisma.js`.

Key models and relations:
```
user ──< cart ──< productoncart >── product
user ──< order ──< productonorder >── product
product >── category
product ──< image   (Cloudinary metadata)
```

- `user.role`: `"user"` (default) | `"admin"`
- `user.enabled`: soft-disable without deleting the account
- `order.orderStatus`: `"Not Process"` (default) — updated by admin
- Deleting a product cascades to `image` and `productonorder` rows

### Image Storage: Cloudinary
- **Upload path**: client opens Cloudinary Upload Widget → widget uploads directly to Cloudinary → widget returns metadata → client sends metadata JSON to server → server stores `asset_id`, `public_id`, `url`, `secure_url` in `image` table
- **Delete path**: server calls `cloudinary.uploader.destroy(public_id)` then deletes DB row
- Cloudinary config loaded from env vars in `controllers/products.js`

### Payment: Stripe
- `POST /api/payment` (auth-gated) creates a `PaymentIntent` using `cart.cartTotal` from DB (not client-sent value), currency THB, amount × 100
- Client uses `@stripe/react-stripe-js` to render the payment form with the returned `clientSecret`
- After success, `POST /api/save-order` records the order, decrements product quantities, and clears the cart

---

## Frontend (`client/src/`)

### State: Zustand (`store/ecom-store.jsx`)
Single store persisted to `localStorage` under key `ecom-store`.

| State key | Contents |
|---|---|
| `user` | JWT payload (`id`, `email`, `role`) |
| `token` | Raw JWT string |
| `categories` | Array from `/api/category` |
| `products` | Array from `/api/products/:count` |
| `carts` | Local cart items (not yet saved to DB) |

Cart is kept locally until checkout, then `POST /api/user-cart` syncs it to the DB.

### Routing: React Router v7 (`routes/AppRoutes.jsx`)
Three layout trees:

```
/                → Layout (public)
  /              → Home
  /shop          → Shop
  /cart          → Cart
  /checkout      → CheckOut
  /login         → Login
  /register      → Register

/admin           → ProtectRouteAdmin → LayoutAdmin
  /admin         → Dashboard
  /admin/category
  /admin/product
  /admin/product/:id  → EditProduct
  /admin/manage

/user            → ProtectRouteUser → LayoutUser
  /user          → HomeUser
  /user/payment  → Payment
```

### Route Protection
`ProtectRouteAdmin` and `ProtectRouteUser` call `current-admin` / `current-user` endpoints **on every render** to verify the token server-side. On failure they render `<LoadingToRedirect />` which navigates away after a countdown.

### API layer (`src/api/`)
Thin axios wrappers. Token is read from the Zustand store and passed explicitly:
```js
headers: { Authorization: `Bearer ${token}` }
```

`auth.jsx` — `currentUser`, `currentAdmin`  
`product.jsx` — CRUD + image upload/remove + search filters  
`Category.jsx` — list categories  
`user.jsx` — cart, order, address  
`Stripe.jsx` — payment intent  

### Key UI flows

**Add to cart → Checkout:**
1. User clicks "Add to Cart" on `ProductCard` → `actionAddtoCart` (Zustand, local only)
2. `/cart` shows local cart via `carts` state
3. `/checkout` → `POST /api/user-cart` syncs local cart to DB (with stock check)
4. `/user/payment` → `POST /api/payment` creates Stripe PaymentIntent
5. Stripe form confirms payment → `POST /api/save-order` creates order, decrements stock, clears DB cart

**Admin product management:**
1. `FormProduct` calls Cloudinary Upload Widget (via `window.cloudinary` global) for images
2. On submit, sends image metadata array + product fields to `POST /api/product`
3. On edit, navigates to `/admin/product/:id` → `FormEditProduct`
4. On delete, removes Cloudinary images first, then deletes DB rows

---

## Environment Variables

| Variable | Used in |
|---|---|
| `DATABASE_URL` | Prisma (MySQL connection string) |
| `SECRET` | JWT sign/verify in `auth.js` and `authCheck.js` |
| `CLOUDINARY_CLOUD_NAME` | `controllers/products.js` |
| `CLOUDINARY_API_KEY` | `controllers/products.js` |
| `CLOUDINARY_API_SECRET` | `controllers/products.js` |
| `STRIPE_SECRET_KEY` | `controllers/Stripe.js` |

Client-side Cloudinary config is hardcoded in `components/admin/Uploadfile.jsx` (cloud name `duuoeothz`, preset `react_upload`). The Upload Widget script must be present in `client/index.html`.
