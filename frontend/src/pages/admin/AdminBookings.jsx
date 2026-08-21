import { useEffect, useMemo, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import Toast from '../../components/Toast'
import { getBookings, updateBookingStatus } from '../../api/bookings'
import { getErrorMessage } from '../../api/client'

const BOOKING_STATUSES = ['Confirmed', 'Cancelled', 'Completed']
const PAYMENT_STATUSES = ['Pending', 'Pay at Hotel', 'Paid', 'Refunded']

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  const load = () => {
    setLoading(true)
    getBookings(statusFilter ? { booking_status: statusFilter } : {})
      .then(setBookings)
      .catch((err) => setToast({ tone: 'error', message: getErrorMessage(err) }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [statusFilter])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return bookings
    return bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestPhone.includes(q) ||
        b.roomName.toLowerCase().includes(q)
    )
  }, [bookings, search])

  const handleStatusChange = async (pk, field, value) => {
    try {
      await updateBookingStatus(pk, { [field]: value })
      setToast({ tone: 'success', message: 'Booking updated.' })
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Bookings</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, guest, phone, or room…"
          className="flex-1 min-w-[220px] bg-white border border-stone rounded-lg px-4 py-2.5 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-stone rounded-lg px-4 py-2.5 text-sm"
        >
          <option value="">All Statuses</option>
          {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-stone overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/50 border-b border-stone">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Room</th>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Booking Status</th>
              <th className="px-5 py-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-5"><Skeleton className="h-40 w-full" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-ink/50">No bookings found.</td></tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.pk} className="border-b border-stone last:border-0 align-top">
                  <td className="px-5 py-3 font-medium whitespace-nowrap">{b.id}</td>
                  <td className="px-5 py-3">{b.roomName}</td>
                  <td className="px-5 py-3">
                    <p>{b.guestName}</p>
                    <p className="text-xs text-ink/40">+91 {b.guestPhone}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p>{b.checkIn}</p>
                    <p className="text-xs text-ink/40">to {b.checkOut}</p>
                  </td>
                  <td className="px-5 py-3">₹{b.total}</td>
                  <td className="px-5 py-3">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleStatusChange(b.pk, 'bookingStatus', e.target.value)}
                      className="bg-ivorySoft border border-stone rounded-lg px-2 py-1.5 text-xs"
                    >
                      {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={b.paymentStatus}
                      onChange={(e) => handleStatusChange(b.pk, 'paymentStatus', e.target.value)}
                      className="bg-ivorySoft border border-stone rounded-lg px-2 py-1.5 text-xs"
                    >
                      {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
