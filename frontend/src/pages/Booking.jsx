import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PhoneLogin from '../components/PhoneLogin'
import Skeleton from '../components/Skeleton'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { createBooking } from '../api/bookings'
import { getRoom } from '../api/rooms'
import { getErrorMessage } from '../api/client'
import usePageTitle from '../hooks/usePageTitle'

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const ms = new Date(checkOut) - new Date(checkIn)
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  usePageTitle(room ? `Book ${room.name}` : 'Booking')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState({
    guestName: user?.name || '',
    guestEmail: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    specialRequests: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getRoom(id)
      .then((r) => !cancelled && (setRoom(r), setLoadError('')))
      .catch((err) => !cancelled && setLoadError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const nights = useMemo(() => nightsBetween(form.checkIn, form.checkOut), [form.checkIn, form.checkOut])
  const total = room && nights > 0 ? nights * room.price : 0

  if (loading) {
    return (
      <div className="pt-28 pb-24 max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[1.3fr_1fr] gap-12">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (loadError || !room) {
    return (
      <div className="pt-40 pb-32 max-w-lg mx-auto px-5 text-center">
        <span className="eyebrow text-wine">Tawakkal</span>
        <h1 className="font-display text-4xl mt-3">Room Not Found</h1>
        <p className="text-ink/60 mt-3">{loadError}</p>
        <Link to="/rooms" className="inline-block mt-8 bg-brass text-ink font-semibold px-7 py-3 rounded-full">
          Browse All Rooms
        </Link>
      </div>
    )
  }

  if (!room.available) {
    return (
      <div className="pt-40 pb-32 max-w-lg mx-auto px-5 text-center">
        <span className="eyebrow text-wine">Tawakkal</span>
        <h1 className="font-display text-4xl mt-3">This Room Is Fully Booked</h1>
        <p className="text-ink/60 mt-3">Try another room — most of our AC rooms are similarly priced.</p>
        <Link to="/rooms" className="inline-block mt-8 bg-brass text-ink font-semibold px-7 py-3 rounded-full">
          Browse All Rooms
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center">
        <div className="max-w-md mx-auto w-full px-5">
          <div className="text-center mb-8">
            <span className="eyebrow text-wine">Sign In to Continue</span>
            <h1 className="font-display text-3xl mt-3">Booking: {room.name}</h1>
            <p className="text-ink/60 mt-2 text-sm">We'll text booking confirmations to your number.</p>
          </div>
          <PhoneLogin onSuccess={() => {}} />
        </div>
      </div>
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.guestName.trim()) errs.guestName = 'Enter the guest name.'
    if (!/^\S+@\S+\.\S+$/.test(form.guestEmail)) errs.guestEmail = 'Enter a valid email.'
    if (!form.checkIn) errs.checkIn = 'Select a check-in date.'
    if (!form.checkOut) errs.checkOut = 'Select a check-out date.'
    if (form.checkIn && form.checkOut && nights < 1) errs.checkOut = 'Check-out must be after check-in.'
    if (form.checkIn && form.checkIn < todayISO()) errs.checkIn = 'Check-in cannot be in the past.'
    if (Number(form.adults) + Number(form.children) > room.guests) {
      errs.adults = `This room fits up to ${room.guests} guests.`
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      const booking = await createBooking({
        roomId: room.id,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: user.phone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        adults: Number(form.adults),
        children: Number(form.children),
        specialRequests: form.specialRequests,
      })
      navigate('/my-bookings', { state: { justBookedId: booking.id } })
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-28 pb-24">
      <section className="max-w-7xl mx-auto px-5 md:px-8 mb-12">
        <span className="eyebrow text-wine">Reserve Your Room</span>
        <h1 className="font-display text-4xl md:text-5xl mt-3">{room.name}</h1>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[1.3fr_1fr] gap-12">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Guest Name</label>
              <input
                type="text"
                value={form.guestName}
                onChange={update('guestName')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              {errors.guestName && <p className="text-xs text-wine mt-1">{errors.guestName}</p>}
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Email</label>
              <input
                type="email"
                value={form.guestEmail}
                onChange={update('guestEmail')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              {errors.guestEmail && <p className="text-xs text-wine mt-1">{errors.guestEmail}</p>}
            </div>
          </div>

          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Mobile Number</label>
            <input
              type="text"
              disabled
              value={`+91 ${user.phone}`}
              className="w-full bg-stone/30 border border-stone rounded-lg px-4 py-2.5 text-sm text-ink/60"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Check-in</label>
              <input
                type="date"
                min={todayISO()}
                value={form.checkIn}
                onChange={update('checkIn')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              {errors.checkIn && <p className="text-xs text-wine mt-1">{errors.checkIn}</p>}
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Check-out</label>
              <input
                type="date"
                min={form.checkIn || todayISO()}
                value={form.checkOut}
                onChange={update('checkOut')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              {errors.checkOut && <p className="text-xs text-wine mt-1">{errors.checkOut}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Adults</label>
              <select
                value={form.adults}
                onChange={update('adults')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              >
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.adults && <p className="text-xs text-wine mt-1">{errors.adults}</p>}
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Children</label>
              <select
                value={form.children}
                onChange={update('children')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              >
                {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Special Requests (optional)</label>
            <textarea
              rows={3}
              value={form.specialRequests}
              onChange={update('specialRequests')}
              className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brass hover:bg-brassSoft disabled:opacity-60 text-ink font-semibold py-3.5 rounded-full transition-colors"
          >
            {submitting ? 'Confirming…' : 'Confirm Booking'}
          </button>
        </form>

        <aside className="h-fit bg-ivorySoft rounded-2xl p-7">
          <h2 className="font-display text-2xl mb-5">Booking Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Room</span>
              <span className="font-medium text-right">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Check-in</span>
              <span className="font-medium">{form.checkIn || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Check-out</span>
              <span className="font-medium">{form.checkOut || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Nights</span>
              <span className="font-medium">{nights > 0 ? nights : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Guests</span>
              <span className="font-medium">
                {form.adults} Adult{form.adults > 1 ? 's' : ''}
                {Number(form.children) > 0 ? `, ${form.children} Child${form.children > 1 ? 'ren' : ''}` : ''}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-stone">
              <span className="text-ink/60">Rate</span>
              <span className="font-medium">₹{room.price} / night</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-stone text-base">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl text-wine">₹{total || 0}</span>
            </div>
          </div>
          <p className="text-xs text-ink/40 mt-5">
            Online payment isn't connected yet — you'll pay at the hotel for now.
          </p>
        </aside>
      </section>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
