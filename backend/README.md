# Tawakkal Restaurant & Hotel — Backend

Django + Django REST Framework + MySQL API for the frontend in `../frontend`. Replaces
the mock `localStorage` stores (`AuthContext`, `bookingsStore.js`, `rooms.js`) with real
endpoints.

## Stack

- Django 5 + Django REST Framework
- MySQL (via `mysqlclient`)
- JWT auth (`djangorestframework-simplejwt`) issued after phone/OTP verification —
  matches the frontend's phone-number sign-in, not email/password
- `django-cors-headers` for the Vite dev server
- `django-filter` for room/booking filtering

## Apps

| App | Models | Purpose |
|---|---|---|
| `accounts` | `User`, `PhoneOTP` | Phone-based auth, OTP send/verify, JWT issuance |
| `hotel` | `Room`, `RoomImage`, `Facility` | Room catalog, image uploads, amenities |
| `bookings` | `Booking`, `Payment` | Reservations, server-side double-booking prevention, Razorpay-ready `Payment` model |
| `restaurant` | `RestaurantCategory`, `FoodItem` | Menu |
| `reviews` | `Review` | Guest reviews, admin approval |
| `contact` | `ContactMessage` | Contact form submissions |
| `dashboard` | — | Aggregated stats for the admin panel |
| `notifications` | — | Booking confirmation/cancellation emails (not a Django app — just a helper module, no models) |

## Payments (Razorpay)

`POST /api/bookings/:id/create-order/` creates a Razorpay order and a matching `Payment`
row; `POST /api/bookings/:id/verify-payment/` verifies the signature and flips
`payment_status` to `Paid`. Both return a clean `503` with a friendly message
(`"Online payments are not configured yet..."`) until `RAZORPAY_KEY_ID` /
`RAZORPAY_KEY_SECRET` are set in `.env` — bookings work fully without them, just staying
on `Pay at Hotel`.

## Email notifications

`notifications/emails.py` sends a confirmation email the moment a booking is created, and
a cancellation email when one is cancelled. `EMAIL_BACKEND` defaults to Django's console
backend (prints to the terminal) — set `EMAIL_BACKEND=smtp` plus the `EMAIL_*` vars in
`.env` to send real mail. Email failures are logged, not raised, so a bad SMTP config
never blocks a booking.

## User accounts are saved automatically

Every OTP verification calls `User.objects.get_or_create(phone=phone)` — a row lands in
MySQL the moment someone signs in for the first time, before they've entered a name. The
frontend then prompts new users for a name and saves it via `PATCH /api/auth/me/`. No
separate "register" step exists; sign-in *is* registration.

## Admin login

Staff sign in through the exact same phone/OTP flow as guests — there's no separate admin
password. What makes an account "admin" is `is_staff=True` on the `User` row, set via
`createsuperuser` or the Django admin. The frontend's `/admin` route checks
`user.is_staff` and shows a dashboard (or an access-denied message) accordingly; visiting
`/admin` while signed out bounces to `/login` and back once authenticated.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit DB credentials, SECRET_KEY, etc.
```

### Database

Create the MySQL database first:

```sql
CREATE DATABASE tawakkal_hotel CHARACTER SET utf8mb4;
```

Then run migrations and seed sample data:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --phone 9999999999   # prompts for a password
python manage.py seed_data                             # loads rooms, facilities, menu
```

### Run

```bash
python manage.py runserver
```

API is available at `http://localhost:8000/api/`, admin panel at
`http://localhost:8000/admin/`.

## Authentication flow (matches the frontend exactly)

1. `POST /api/auth/otp/send/` `{ "phone": "9876543210" }` — generates a 6-digit OTP.
   **No real SMS provider is wired up** — the OTP is printed to the console
   (`accounts/sms.py`). Swap that function for a real provider (MSG91, Twilio, etc.)
   when going live.
2. `POST /api/auth/otp/verify/` `{ "phone": "9876543210", "code": "123456" }` — verifies
   the code, creates the user on first sign-in, and returns:
   ```json
   { "access": "...", "refresh": "...", "user": {...}, "is_new_user": true }
   ```
3. Send `Authorization: Bearer <access>` on subsequent requests.
4. `GET/PATCH /api/auth/me/` — read or update the signed-in user's profile (e.g. set
   `name` for a first-time user).

## Key endpoints

```
POST   /api/auth/otp/send/
POST   /api/auth/otp/verify/
GET    /api/auth/me/

GET    /api/rooms/                 ?room_type=&is_available=&guests=&ordering=
GET    /api/rooms/:id/
GET    /api/facilities/            ?category=hotel|restaurant

GET    /api/bookings/              (mine, or all for staff)
POST   /api/bookings/              (auth required — creates a booking)
POST   /api/bookings/:id/cancel/
PATCH  /api/bookings/:id/          (staff only — change status)

GET    /api/restaurant/categories/
GET    /api/restaurant/items/      ?category=&is_available=&is_veg=

GET    /api/reviews/               (approved only, unless staff)
POST   /api/reviews/               (auth required)

POST   /api/contact/               (public)
GET    /api/contact/               (staff only)

GET    /api/dashboard/stats/       (staff only)
```

Full browsable API and exact fields are visible at each URL when `DEBUG=True`.

## Double-booking prevention

Enforced in two places, both required:

- `Booking.clean()` — model-level check for overlapping `Confirmed` bookings on the same
  room, run on every `save()`.
- `BookingSerializer.validate()` — the same check at the API layer, so it fails with a
  clean `400` response instead of a raw database/model exception.

## Wiring up the frontend

Replace these three files in `frontend/src` with real API calls (each has `TODO`
comments marking exactly where):

- `src/context/AuthContext.jsx` → `POST /api/auth/otp/send/`, `POST /api/auth/otp/verify/`
- `src/lib/bookingsStore.js` → `POST /api/bookings/`, `GET /api/bookings/`, `POST /api/bookings/:id/cancel/`
- `src/data/rooms.js` → `GET /api/rooms/`

Add `axios` with a base client that attaches the JWT `access` token from
`AuthContext`'s storage to the `Authorization` header, and handles 401s by clearing the
session.

## Still to build

- Real SMS provider for OTPs (currently logs to console)
- Production settings (static/media via S3 or similar, `DEBUG=False`, real `ALLOWED_HOSTS`)
- Server-side rendering or pre-rendering for full SEO (the SPA sets `document.title` per
  page client-side, which search crawlers that don't execute JS won't see)
