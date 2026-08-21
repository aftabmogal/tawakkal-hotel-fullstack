# Tawakkal Restaurant & Hotel

Full-stack site for the real Hotel Tavakkal & Restaurant, Bail Bazar, Kurla West, Mumbai.

```
tawakkal-hotel/
├── frontend/   React + Vite + Tailwind — public site + admin panel, wired to the API
└── backend/    Django + DRF + MySQL API — auth, bookings, payments, notifications
```

## Quick start

**Backend:**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser --phone 9999999999   # this becomes your admin account
python manage.py seed_data
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## What's built

- **Public site** — Home, Rooms, Room Details, Booking, My Bookings, Restaurant menu,
  Facilities, Gallery, About, Contact, phone/OTP sign-in — all real data, no mocks
- **Admin panel** (`/admin`, staff-only, same phone/OTP login as guests) — dashboard,
  rooms, facilities, bookings, customers, restaurant menu, reviews, contact messages
- **Payments** — Razorpay order creation + signature verification; bookings default to
  "Pay at Hotel" until Razorpay keys are configured
- **Email notifications** — booking confirmation and cancellation emails (console backend
  in dev, real SMTP via `.env`)
- **Accounts auto-save to MySQL** — every OTP verification does a `get_or_create` on the
  `User` table; there's no separate registration step

## Still to build

- Real SMS provider for OTPs (currently logs to console)
- Server-side rendering / pre-rendering for full SEO
- Production deployment config (static/media storage, `DEBUG=False`, real hosts/domain)
