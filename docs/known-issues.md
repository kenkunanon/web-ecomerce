# Known Issues / TODOs

Last scanned: 2026-05-12

---

## Critical Bugs (will crash / break flow)

### 1. `getUserCart` crashes when user has no cart
**File:** `server/controllers/user.js:143`  
`cart` can be `null` if the user has never added anything. Accessing `cart.products` / `cart.cartTotal` throws TypeError → 500.  
**Fix:** add `if (!cart) return res.status(400).json({ message: 'Cart not found' })` before line 143.

### 2. `searchFilters` sends multiple HTTP responses
**File:** `server/controllers/products.js:263–285`  
If the client sends two or more filters at once (e.g. `query + category`), each inner handler calls `res.send()` independently → "Cannot set headers after they are sent" crash.  
**Fix:** use `else if` between the three branches, or merge into a single Prisma query.

### 3. `update` (edit product) leaks images in Cloudinary
**File:** `server/controllers/products.js:93–97`  
`image.deleteMany` removes DB rows but never calls `cloudinary.uploader.destroy`. Old images accumulate in Cloudinary indefinitely.  
**Fix:** fetch existing images, call `destroy` for each before deleting DB rows (same pattern as `remove`).

### 4. `getProduct()` called without `count` after product create
**File:** `client/src/components/admin/FormProduct.jsx:37`  
After a successful create, `getProduct()` is called with no argument → `GET /api/products/undefined` → `parseInt('undefined')` = `NaN` → Prisma `take: NaN` returns all products or errors.  
**Fix:** `getProduct(20)` (same as the initial call).

### 5. `removeImage` callback has wrong signature
**File:** `server/controllers/products.js:309`  
`cloudinary.uploader.destroy(public_id, (result) => {...})` — Cloudinary's callback is `(error, result)`. Errors are silently swallowed and the caller gets a 200 even on failure.  
**Fix:** `(error, result) => { if (error) return res.status(500)...; res.send(...) }`

---

## Medium Bugs (wrong behaviour, no crash)

### 6. `authCheck` returns 500 on invalid/expired token
**File:** `server/middlewares/authCheck.js:25–28`  
JWT decode failure falls into the `catch` block and returns `res.status(500)`. Should be `401 Unauthorized`.  
**Fix:** check `err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'` and return 401.

### 7. `isLoading` reset before `saveOrder` resolves
**File:** `client/src/components/CheckoutForm.jsx:47–62`  
`setIsLoading(false)` on line 62 runs synchronously right after `.then(...)` is attached, not after it resolves. The submit button re-enables before the order is saved.  
**Fix:** move `setIsLoading(false)` inside both `.then()` and `.catch()` callbacks.

### 8. `FormEditProduct` missing `promotion` field
**File:** `client/src/components/admin/FormEditProduct.jsx:10–17`  
`initialState` has no `promotion` key. Editing any product with a promotion resets it to `undefined` on save.  
**Fix:** add `promotion: ""` to `initialState`.

### 9. `order.amount` is `Int` in schema — loses decimal precision
**File:** `server/prisma/schema.prisma:51`  
`amount Int` but `amountTHB = amount / 100` can produce floats (e.g. 2550 satangs → 25.50 THB). Prisma silently truncates.  
**Fix:** change `amount Int` → `amount Float` and run `npx prisma migrate dev`.

### 10. Cart badge `absolute` has no `relative` parent
**File:** `client/src/components/MainNav.jsx:47–50`  
`<span className="absolute top-0 ...">` is inside `<NavLink>` which has no `relative` class → badge floats relative to the nearest positioned ancestor (the `<nav>`).  
**Fix:** add `relative` class to the `<NavLink>`.

### 11. `/shop` and `/cart` are behind `ProtectRouteUser`
**File:** `client/src/routes/AppRoutes.jsx:28–29`  
Guest users are blocked from browsing the shop. Likely unintentional — shop browsing should be public.  
**Fix:** remove `ProtectRouteUser` wrapper from `shop` and `cart` routes (keep it on `checkout` and `user/*`).

### 12. `Uploadfile.handleDelete` — `removeFiles` not awaited
**File:** `client/src/components/admin/Uploadfile.jsx:55`  
`removeFiles(token, public_id)` is fire-and-forget. UI removes the image optimistically; if the API call fails the Cloudinary image remains but the local state no longer knows about it.  
**Fix:** `await removeFiles(...)` inside the try/catch.

---

## Minor / Code Quality

### 13. `ecom-store` persist config typo — `Storage` vs `storage`
**File:** `client/src/store/ecom-store.jsx:82`  
`Storage: createJSONStorage(...)` (capital S) — Zustand's `persist` expects lowercase `storage`. The custom storage config is silently ignored; Zustand falls back to its own default.  
**Fix:** `storage: createJSONStorage(() => localStorage)`.

### 14. `prediction` model in schema but controller/route deleted
**File:** `server/prisma/schema.prisma:61–66`  
`modelPredict.js` controller and route are deleted (git shows `D`), but the `prediction` table model remains in the schema. Dead schema weight.  
**Fix:** remove the `prediction` model block and run `npx prisma migrate dev`.

### 15. `/history` route is public (no auth guard)
**File:** `client/src/routes/AppRoutes.jsx:30`  
`<History />` has no `ProtectRouteUser` wrapper. The page itself calls an auth-gated API, so it fails gracefully, but a blank/error page for unauthenticated users is poor UX.  
**Fix:** wrap with `<ProtectRouteUser element={<History />} />`.

### 16. Hardcoded `http://localhost:5000` in Zustand store
**File:** `client/src/store/ecom-store.jsx:46`  
`actionLogin` uses a hardcoded URL. All other API calls go through `src/api/` axios wrappers (which presumably use a base URL). This one call bypasses that.  
**Fix:** move login call to `src/api/auth.jsx` or use the same axios instance.

### 17. `Register.jsx` uses `alert()` for password mismatch
**File:** `client/src/pages/auth/Register.jsx:24`  
Uses browser `alert()` instead of `toast.error()`. Inconsistent UX with the rest of the app.  
**Fix:** `toast.error('Passwords do not match')`.

### 18. `import { use }` unused in FormEditProduct
**File:** `client/src/components/admin/FormEditProduct.jsx:1`  
`use` is imported from React but never used.  
**Fix:** remove from import.

### 19. ~30+ `console.log` statements left in production code
Both client and server have debugging `console.log` calls scattered throughout controllers and components. Should be removed before production deploy.  
Notable leaks: `Login.jsx:10` logs the full user object on every render; `user.js:57–58` logs cart contents and user IDs on every checkout.

### 20. Prices displayed without currency symbol
`ProductCard`, `CartCard`, `ListCard` show bare numbers (e.g. `250`) with no `฿` prefix/suffix.  
**Fix:** add `฿` or use `toLocaleString('th-TH', { style: 'currency', currency: 'THB' })`.

---

## Summary Table

| # | Severity | File | Issue |
|---|----------|------|-------|
| 1 | Critical | `server/controllers/user.js:143` | `getUserCart` null cart crash |
| 2 | Critical | `server/controllers/products.js:263` | `searchFilters` double-response |
| 3 | Critical | `server/controllers/products.js:93` | edit product leaks Cloudinary images |
| 4 | Critical | `client/…/FormProduct.jsx:37` | `getProduct()` called without count |
| 5 | Critical | `server/controllers/products.js:309` | `removeImage` ignores Cloudinary errors |
| 6 | Medium | `server/middlewares/authCheck.js:25` | wrong HTTP status on bad token |
| 7 | Medium | `client/…/CheckoutForm.jsx:62` | `isLoading` resets too early |
| 8 | Medium | `client/…/FormEditProduct.jsx:10` | `promotion` missing from edit form |
| 9 | Medium | `server/prisma/schema.prisma:51` | `order.amount` Int loses decimals |
| 10 | Medium | `client/…/MainNav.jsx:47` | cart badge positioning broken |
| 11 | Medium | `client/…/AppRoutes.jsx:28` | shop/cart blocked for guests |
| 12 | Medium | `client/…/Uploadfile.jsx:55` | `removeFiles` not awaited |
| 13 | Minor | `client/…/ecom-store.jsx:82` | persist `Storage` typo |
| 14 | Minor | `server/prisma/schema.prisma:61` | dead `prediction` model |
| 15 | Minor | `client/…/AppRoutes.jsx:30` | `/history` no auth guard |
| 16 | Minor | `client/…/ecom-store.jsx:46` | hardcoded localhost URL |
| 17 | Minor | `client/…/Register.jsx:24` | `alert()` instead of toast |
| 18 | Minor | `client/…/FormEditProduct.jsx:1` | unused `use` import |
| 19 | Minor | various | ~30+ debug `console.log` in prod |
| 20 | Minor | various | prices missing `฿` symbol |
