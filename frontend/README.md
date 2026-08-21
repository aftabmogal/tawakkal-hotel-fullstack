# Tawakkal Restaurant & Hotel — Frontend

Full site for the real Hotel Tavakkal & Restaurant, Bail Bazar, Kurla West, Mumbai.
Wired to the Django backend in `../backend` — no mock stores left.

## Design system

- **Colors:** `ink` (deep teal-black), `ivory` (warm background), `brass` (gold accent),
  `wine` (deep plum accent), `sage`, `stone` — see `tailwind.config.js`.
- **Type:** Cormorant Garamond (display/serif) + Manrope (body/utility).
- **Signature motif:** the `ArchFrame` component — a horseshoe-arch image crop used for
  hero panels, room cards, and gallery tiles.

## Run it locally

```bash
cd frontend
npm install
cp .env.example .env    # points at http://localhost:8000/api by default
npm run dev
```

Opens at `http://localhost:5173`. **The backend must be running.**

## Public site

- `Home`, `Rooms` (filterable), `RoomDetails`, `Booking`, `MyBookings`, `Restaurant`
  (menu), `Facilities`, `Gallery`, `About`, `Contact` — all fetching real data from the API
- Phone + OTP sign-in (`PhoneLogin.jsx`), used standalone on `/login` and inline mid-booking
- **Pay Online** — on `MyBookings`, a confirmed-but-unpaid booking shows a "Pay Online"
  button that opens Razorpay Checkout (`src/api/payments.js`). Falls back gracefully to
  "Pay at Hotel" if the backend has no Razorpay keys configured.
- Per-page `<title>` via `src/hooks/usePageTitle.js` (client-side only — see Known Gaps)

## Admin panel (`/admin`)

Staff-only (`user.is_staff`) — same phone/OTP sign-in as guests, no separate admin
password. Visiting `/admin` while signed out redirects to `/login` and back once
authenticated; a footer link and a hint on the login page point staff there.

- **Dashboard** — stats + recent bookings
- **Rooms** — add/edit/delete, availability toggle, photos by URL
- **Facilities** — add/edit/delete hotel & restaurant amenities
- **Bookings** — search, filter, inline status changes
- **Customers** — guest list with booking history
- **Restaurant** — category/item CRUD, inline price editing
- **Reviews** — approve/reject
- **Messages** — contact inbox, mark read/unread

## API layer (`src/api/`)

One file per resource, all built on `client.js` — attaches the JWT access token, refreshes
it on 401, clears the session if refresh fails. `getErrorMessage()` extracts a readable
message from DRF's error response shapes.

## Known gaps

- **No real SMS provider** — OTPs print to the Django console.
- **No production Razorpay keys** — payment UI is fully wired but untested against a real
  Razorpay account.
- **Client-side-only page titles/SEO** — this is a plain Vite SPA; a crawler that doesn't
  execute JavaScript won't see per-page titles or content. For real SEO, consider
  pre-rendering or moving to an SSR framework before launch.
- `sitemap.xml` uses placeholder URLs (`https://example.com/...`) — swap in the live domain.
