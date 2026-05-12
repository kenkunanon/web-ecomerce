# Testing

## Current State

**No automated tests exist** in this project. The server's `package.json` has a placeholder `"test": "echo \"Error: no test specified\" && exit 1"`. The client has no test framework configured.

All verification is currently done manually.

---

## Manual Testing Checklist

### Prerequisites
- Server running: `cd server && npm start` (port 5000)
- Client running: `cd client && npm run dev` (port 5173)
- MySQL running with a valid `DATABASE_URL` in `server/.env`

### Auth
- [ ] Register a new account at `/register`
- [ ] Login at `/login` → redirects to previous page (user) or `/admin` (admin)
- [ ] Access `/admin` without logging in → should redirect away
- [ ] Access `/user` without logging in → should redirect away
- [ ] Disable a user account via admin `/admin/manage` → that user cannot login

### Shop & Cart
- [ ] Browse products at `/shop`, use search/filter by name, price, category
- [ ] Add a product to cart, verify count updates in navbar
- [ ] Add the same product twice → quantity should not duplicate (lodash `unionWith`)
- [ ] Update quantity in `/cart`, remove an item
- [ ] Submit cart at `/checkout` with a product quantity exceeding stock → should get error toast

### Checkout & Payment
- [ ] Complete checkout flow to `/user/payment`
- [ ] Enter Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC
- [ ] After payment, check `/history` for the new order
- [ ] Check stock quantity decreased in admin product list

### Admin
- [ ] Create a product with images via Cloudinary widget at `/admin/product`
- [ ] Edit a product at `/admin/product/:id` — verify image changes persist
- [ ] Delete a product — verify image is removed from Cloudinary
- [ ] Create/delete a category at `/admin/category`
- [ ] Change order status at `/admin/manage`
- [ ] Change user role/status at `/admin/manage`

### API Testing with curl/Postman
```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# List products (no auth needed)
curl http://localhost:5000/api/products/10

# Current user (requires token from login response)
curl -X POST http://localhost:5000/api/current-user \
  -H "Authorization: Bearer <token>"
```

---

## Adding Automated Tests (Recommended Next Steps)

### Server — Jest + Supertest
```bash
cd server
npm install --save-dev jest supertest
```
Add to `package.json`:
```json
"scripts": { "test": "jest" },
"jest": { "testEnvironment": "node" }
```

Priority test targets:
1. `controllers/auth.js` — register/login validation logic
2. `middlewares/authCheck.js` — token verification and `enabled` flag
3. `controllers/user.js` — `userCart` stock check, `saveOrder` quantity decrement

### Client — Vitest + React Testing Library
Vitest is the natural choice since the project already uses Vite.
```bash
cd client
npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom
```

Priority test targets:
1. `store/ecom-store.jsx` — `actionAddtoCart` deduplication, `actionUpdateQuantity`, `getTotalPrice`
2. `routes/ProtectRouteAdmin.jsx` / `ProtectRouteUser.jsx` — redirect behavior
