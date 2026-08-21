import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '../../components/Skeleton'
import { getDashboardStats } from '../../api/dashboard'
import { getErrorMessage } from '../../api/client'

const CARDS = [
  { key: 'total_bookings', label: 'Total Bookings' },
  { key: 'todays_bookings', label: "Today's Bookings" },
  { key: 'available_rooms', label: 'Available Rooms' },
  { key: 'occupied_rooms', label: 'Occupied Rooms' },
  { key: 'total_customers', label: 'Total Customers' },
  { key: 'unread_messages', label: 'Unread Messages' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      {error && <p className="text-sm text-wine mb-6">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {!stats && !error
          ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          : CARDS.map((c) => (
              <div key={c.key} className="bg-white rounded-2xl p-6 border border-stone">
                <p className="text-xs text-ink/50">{c.label}</p>
                <p className="font-display text-3xl text-wine mt-2">{stats?.[c.key] ?? '—'}</p>
              </div>
            ))}
        {stats && (
          <div className="bg-white rounded-2xl p-6 border border-stone">
            <p className="text-xs text-ink/50">Revenue (Confirmed)</p>
            <p className="font-display text-3xl text-wine mt-2">₹{stats.revenue}</p>
          </div>
        )}
      </div>

      <h2 className="font-display text-2xl mb-4">Recent Bookings</h2>
      <div className="bg-white rounded-2xl border border-stone overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/50 border-b border-stone">
              <th className="px-5 py-3">Booking ID</th>
              <th className="px-5 py-3">Room</th>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Check-in</th>
              <th className="px-5 py-3">Check-out</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recent_bookings?.length ? (
              stats.recent_bookings.map((b) => (
                <tr key={b.booking_id} className="border-b border-stone last:border-0">
                  <td className="px-5 py-3 font-medium">{b.booking_id}</td>
                  <td className="px-5 py-3">{b.room}</td>
                  <td className="px-5 py-3">{b.guest_name}</td>
                  <td className="px-5 py-3">{b.check_in}</td>
                  <td className="px-5 py-3">{b.check_out}</td>
                  <td className="px-5 py-3">₹{b.total_amount}</td>
                  <td className="px-5 py-3">{b.booking_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-ink/50">
                  {stats ? 'No bookings yet.' : 'Loading…'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link to="/admin/bookings" className="inline-block mt-4 text-sm text-wine underline">
        View all bookings →
      </Link>
    </div>
  )
}
