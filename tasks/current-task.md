# Current Task

## Branch Status (as of 2026-05-12)

Branch: `main` — 1 commit ahead of initial clean commit (`9606331`)

### Modified Files
| File | Notes |
|---|---|
| `client/index.html` | likely Cloudinary widget script tag added |
| `client/package.json` / `package-lock.json` | dependencies updated |
| `client/src/components/admin/FormProduct.jsx` | promotion field added |
| `client/src/components/admin/Uploadfile.jsx` | switched to Cloudinary Upload Widget |
| `client/src/pages/Home.jsx` | landing page redesigned |
| `client/src/pages/auth/Register.jsx` | confirmPassword field added, UI updated |
| `server/controllers/products.js` | promotion field support, Cloudinary delete fix |
| `server/package.json` / `package-lock.json` | dependencies updated |
| `server/prisma/schema.prisma` | `promotion` column added to `product` model |

### Deleted Files
| File | Notes |
|---|---|
| `server/controllers/modelPredict.js` | AI model prediction feature removed |
| `server/routes/ModelPredict.js` | corresponding route removed |

---

## Known Issues / TODOs



---

## Workflow for Future Sessions

### Starting a new feature
1. Read `docs/architecture.md` to orient yourself
2. Check this file for known issues that might affect your work
3. Run both servers: `cd server && npm start` and `cd client && npm run dev`
4. Create a feature branch: `git checkout -b feature/<name>`

### Adding a new API endpoint
1. Add handler to the relevant `server/controllers/*.js`
2. Register route in `server/routes/*.js` — add `authCheck` or `adminCheck` as needed
3. Add axios wrapper in `client/src/api/*.jsx`
4. Call from Zustand store action (if it affects global state) or directly from component

### Adding a new page/route
1. Create component in `client/src/pages/`
2. Register in `client/src/routes/AppRoutes.jsx` under the correct layout tree
3. If protected, use existing `ProtectRouteUser` or `ProtectRouteAdmin` wrapper

### Schema changes
1. Edit `server/prisma/schema.prisma`
2. Run `cd server && npx prisma migrate dev --name <description>`
3. Run `npx prisma generate` to update the client
4. Update relevant controllers to use the new fields

### Before committing
- [ ] Both servers start without errors
- [ ] Run `cd client && npm run lint`
- [ ] Manually test the changed flow (see `docs/testing.md`)
- [ ] No `console.log` left in production paths
- [ ] No hardcoded secrets or API keys in new code
