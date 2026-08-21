import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PhoneLogin from '../components/PhoneLogin'
import Skeleton from '../components/Skeleton'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { cancelBooking, getMyBookings } from '../api/bookings'
import { createOrder, verifyPayment } from '../api/payments'
import { getErrorMessage } from '../api/client'
import usePageTitle from '../hooks/usePageTitle'

const STATUS_STYLES = {
  Confirmed: 'bg-sage/20 text-sage',
  Cancelled: 'bg-stone text-ink/50',
  Completed: 'bg-brass/20 text-brass',
}

function isCancellable(booking) {
  if (booking.bookingStatus !== 'Confirmed') return false
  const hoursToCheckIn = (new Date(booking.checkIn) - new Date()) / 36e5
  return hoursToCheckIn > 24
}

export default function MyBookings() {
  usePageTitle('My Bookings')
  const { user } = useAuth()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const load = () => {
    if (!user) return
    setLoading(true)
    getMyBookings()
      .then((data) => (setBookings(data), setError('')))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [user])

  useEffect(() => {
    if (location.state?.justBookedId) {
      setToast({
        tone: 'success',
        message: `Booking confirmed — ID ${location.state.justBookedId}. Pay online below or at check-in.`,
      })
    }
  }, [location.state])

  const handleCancel = async (pk) => {
    if (!window.confirm('Cancel this booking? This cannot be undone.')) return
    try {
      await cancelBooking(pk)
      load()
      setToast({ tone: 'success', message: 'Booking cancelled.' })
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handlePayOnline = async (booking) => {
    if (typeof window.Razorpay === 'undefined') {
      setToast({ tone: 'error', message: 'Payment window failed to load. Please try again.' })
      return
    }
    try {
      const order = await createOrder(booking.pk)
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'Tawakkal Restaurant & Hotel',
        description: `Booking ${order.booking_id}`,
        prefill: { contact: user.phone, name: user.name || '' },
        theme: { color: '#B8934A' },
        handler: async (response) => {
          try {
            await verifyPayment(booking.pk, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            setToast({ tone: 'success', message: 'Payment successful!' })
            load()
          } catch (err) {
            setToast({ tone: 'error', message: getErrorMessage(err) })
          }
        },
        modal: {
          ondismiss: () => setToast({ tone: 'error', message: 'Payment cancelled.' }),
        },
      })
      rzp.on('payment.failed', () => setToast({ tone: 'error', message: 'Payment failed. Please try again.' }))
      rzp.open()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center">
        <div className="max-w-md mx-auto w-full px-5">
          <div className="text-center mb-8">
            <span className="eyebrow text-wine">My Bookings</span>
            <h1 className="font-display text-3xl mt-3">Sign In to View</h1>
          </div>
          <PhoneLogin onSuccess={() => {}} />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-5 md:px-8">
      <span className="eyebrow text-wine">Welcome back{user.name ? `, ${user.name}` : ''}</span>
      <h1 className="font-display text-4xl md:text-5xl mt-3 mb-10">My Bookings</h1>

      {loading && (
        <div className="space-y-5">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20 border border-dashed border-stone rounded-2xl">
          <p className="font-display text-2xl mb-2">Couldn't load bookings</p>
          <p className="text-ink/60 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20 border border-dashed border-stone rounded-2xl">
          <p className="font-display text-2xl mb-2">No bookings yet</p>
          <p className="text-ink/60 text-sm mb-6">Find a room and book your stay.</p>
          <Link to="/rooms" className="inline-block bg-brass text-ink font-semibold px-6 py-2.5 rounded-full text-sm">
            Browse Rooms
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-5">
          {bookings.map((b) => (
            <div key={b.pk} className="border border-stone rounded-2xl p-6 grid md:grid-cols-[1fr_auto] gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-display text-xl">{b.roomName}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.bookingStatus] || 'bg-stone text-ink/60'}`}>
                    {b.bookingStatus}
                  </span>
                  <span className="text-xs text-ink/50">{b.paymentStatus}</span>
                </div>
                <p className="text-xs text-ink/40 mt-1">Booking ID: {b.id}</p>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <dt className="text-ink/50 text-xs">Check-in</dt>
                    <dd className="font-medium">{b.checkIn}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/50 text-xs">Check-out</dt>
                    <dd className="font-medium">{b.checkOut}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/50 text-xs">Guests</dt>
                    <dd className="font-medium">
                      {b.adults} Adult{b.adults > 1 ? 's' : ''}
                      {b.children > 0 ? `, ${b.children} Child${b.children > 1 ? 'ren' : ''}` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink/50 text-xs">Amount</dt>
                    <dd className="font-medium">₹{b.total}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex md:items-center gap-3">
                {b.bookingStatus === 'Confirmed' && b.paymentStatus !== 'Paid' && (
                  <button
                    onClick={() => handlePayOnline(b)}
                    className="text-sm bg-brass hover:bg-brassSoft text-ink font-semibold px-5 py-2 rounded-full whitespace-nowrap transition-colors"
                  >
                    Pay Online
                  </button>
                )}
                {isCancellable(b) ? (
                  <button
                    onClick={() => handleCancel(b.pk)}
                    className="text-sm border border-wine text-wine hover:bg-wine hover:text-ivory transition-colors px-5 py-2 rounded-full whitespace-nowrap"
                  >
                    Cancel Booking
                  </button>
                ) : (
                  b.bookingStatus === 'Confirmed' && (
                    <span className="text-xs text-ink/40">Not cancellable (within 24h)</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
