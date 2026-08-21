import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickBookWidget() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
  })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(form).toString()
    navigate(`/rooms?${params}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-ivory rounded-2xl shadow-soft p-5 md:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 items-end"
    >
      <div className="col-span-1">
        <label className="eyebrow text-ink/60 block mb-1.5">Check-in</label>
        <input
          type="date"
          required
          value={form.checkIn}
          onChange={update('checkIn')}
          className="w-full bg-transparent border-b border-ink/20 py-1.5 text-sm focus:outline-none focus:border-brass"
        />
      </div>
      <div className="col-span-1">
        <label className="eyebrow text-ink/60 block mb-1.5">Check-out</label>
        <input
          type="date"
          required
          value={form.checkOut}
          onChange={update('checkOut')}
          className="w-full bg-transparent border-b border-ink/20 py-1.5 text-sm focus:outline-none focus:border-brass"
        />
      </div>
      <div className="col-span-1">
        <label className="eyebrow text-ink/60 block mb-1.5">Guests</label>
        <select
          value={form.guests}
          onChange={update('guests')}
          className="w-full bg-transparent border-b border-ink/20 py-1.5 text-sm focus:outline-none focus:border-brass"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} Guest{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2 md:col-span-2">
        <button
          type="submit"
          className="w-full bg-wine hover:bg-wine/90 text-ivory font-semibold text-sm py-3 rounded-full transition-colors"
        >
          Search Availability
        </button>
      </div>
    </form>
  )
}
