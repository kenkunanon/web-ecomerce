# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce web application with a React (Vite) frontend and an Express/Node.js backend. The two apps run independently and communicate via REST API at `http://localhost:5000/api`.

## Commands

### Client (frontend) — run from `client/`
```bash
npm run dev       # start Vite dev server (default port 5173)
npm run build     # production build
npm run lint      # ESLint
```

### Server (backend) — run from `server/`
```bash
npm start         # start Express with nodemon (port 5000)
```

### Database — run from `server/`
```bash
npx prisma migrate dev    # apply migrations
npx prisma studio         # browse data in browser
npx prisma generate       # regenerate Prisma client after schema changes
```

## Architecture

### Backend (`server/`)
- **Entry**: `server.js` — auto-loads all files in `routes/` via `readdirSync`, mounts them under `/api`
- **Routes → Controllers**: each route file maps HTTP methods to a controller function
- **Auth flow**: JWT signed with `process.env.SECRET`. Token is verified in `middlewares/authCheck.js` (`authCheck` for any user, `adminCheck` for admin-only routes). The `user.enabled` flag can disable accounts without deletion.
- **Database**: MySQL via Prisma ORM. Schema in `server/prisma/schema.prisma`. Config singleton in `server/config/prisma.js`.
- **Image storage**: Cloudinary. Product images are uploaded via the Cloudinary Upload Widget on the client, then metadata (asset_id, public_id, url, secure_url) is stored in the `image` table with a `productId` FK. Deleting a product cascades image DB rows and also calls `cloudinary.uploader.destroy` for each.
- **Payments**: Stripe PaymentIntents, amount in THB (× 100 for smallest unit). The cart total from the DB is used — not the client-sent amount.

### Frontend (`client/src/`)
- **State management**: Zustand with `persist` middleware (`localStorage`, key `ecom-store`). The store (`store/ecom-store.jsx`) holds `user`, `token`, `categories`, `products`, and `carts`. All API calls that mutate global state are actions in this store.
- **Routing**: React Router v7 (`routes/AppRoutes.jsx`). Three layout trees:
  - `/` → `Layout` (public pages: home, shop, cart, checkout, login, register)
  - `/admin` → `ProtectRouteAdmin` → `LayoutAdmin` (dashboard, product/category management)
  - `/user` → `ProtectRouteUser` → `LayoutUser` (profile, payment)
- **Route protection**: `ProtectRouteAdmin` and `ProtectRouteUser` call `current-admin` / `current-user` endpoints to verify the stored token server-side; on failure they render `LoadingToRedirect` which navigates away.
- **API layer**: thin axios wrappers in `src/api/`. Auth header is passed explicitly as `Authorization: Bearer <token>` retrieved from the Zustand store.

### Data model (key relationships)
- `user` → many `cart`, many `order`
- `cart` → many `productoncart` (join table with `count` and `price`)
- `order` → many `productonorder` (same shape)
- `product` → optional `category`, many `image` (Cloudinary metadata), many `productoncart`, many `productonorder`
- `user.role` is `"user"` (default) or `"admin"`; enforced server-side via `adminCheck` middleware

## Environment Variables

**`server/.env`** (required):
```
DATABASE_URL=mysql://...
SECRET=<jwt secret>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
```

**`client/`**: No `.env` needed by default — the Cloudinary cloud name and upload preset are hardcoded in `Uploadfile.jsx` (`duuoeothz` / `react_upload`). The Cloudinary Upload Widget script must be loaded in `index.html` via a `<script>` tag (`window.cloudinary`).
