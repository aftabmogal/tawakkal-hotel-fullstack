import { Fragment, useEffect, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import { getCustomers } from '../../api/auth'
import { getBookings } from '../../api/bookings'
import { getErrorMessage } from '../../api/client'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(res.data.results ?? res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = async (customer) => {
    if (expandedId === customer.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(customer.id)
    setHistoryLoading(true)
    try {
      const bookings = await getBookings({ user: customer.id })
      setHistory(bookings)
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>

      {error && <p className="text-sm text-wine mb-4">{error}</p>}

      <div className="bg-white rounded-2xl border border-stone overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/50 border-b border-stone">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Bookings</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-5"><Skeleton className="h-32 w-full" /></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-ink/50">No customers yet.</td></tr>
            ) : (
              customers.map((c) => (
                <Fragment key={c.id}>
                  <tr className="border-b border-stone last:border-0">
                    <td className="px-5 py-3 font-medium">{c.name || '—'}</td>
                    <td className="px-5 py-3">+91 {c.phone}</td>
                    <td className="px-5 py-3">{new Date(c.date_joined).toLocaleDateString()}</td>
                    <td className="px-5 py-3">{c.booking_count}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => toggleExpand(c)} className="text-wine text-xs font-semibold">
                        {expandedId === c.id ? 'Hide' : 'View'} History
                      </button>
                    </td>
                  </tr>
                  {expandedId === c.id && (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 bg-ivorySoft">
                        {historyLoading ? (
                          <Skeleton className="h-16 w-full" />
                        ) : history.length === 0 ? (
                          <p className="text-ink/50 text-xs">No bookings from this guest.</p>
                        ) : (
                          <ul className="space-y-2">
                            {history.map((b) => (
                              <li key={b.pk} className="text-xs flex flex-wrap gap-x-4">
                                <span className="font-semibold">{b.id}</span>
                                <span>{b.roomName}</span>
                                <span>{b.checkIn} → {b.checkOut}</span>
                                <span>₹{b.total}</span>
                                <span className="text-ink/50">{b.bookingStatus}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
