import { useEffect, useMemo, useState } from 'react'
import { getRooms } from '../api/rooms'
import { getErrorMessage } from '../api/client'
import RoomCard from '../components/RoomCard'
import Skeleton from '../components/Skeleton'
import usePageTitle from '../hooks/usePageTitle'

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Family']

export default function Rooms() {
  usePageTitle('Rooms')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [maxPrice, setMaxPrice] = useState(5000)
  const [types, setTypes] = useState([])
  const [minGuests, setMinGuests] = useState(1)
  const [amenities, setAmenities] = useState([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getRooms()
      .then((data) => {
        if (cancelled) return
        setRooms(data)
        const highest = Math.max(...data.map((r) => r.price), 5000)
        setMaxPrice(highest)
        setError('')
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  const maxRoomPrice = useMemo(
    () => (rooms.length ? Math.max(...rooms.map((r) => r.price)) : 5000),
    [rooms]
  )
  const allAmenities = useMemo(
    () => Array.from(new Set(rooms.flatMap((r) => r.amenities))).sort(),
    [rooms]
  )

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (r.price > maxPrice) return false
      if (types.length && !types.includes(r.type)) return false
      if (r.guests < minGuests) return false
      if (amenities.length && !amenities.every((a) => r.amenities.includes(a))) return false
      return true
    })
  }, [rooms, maxPrice, types, minGuests, amenities])

  const resetFilters = () => {
    setMaxPrice(maxRoomPrice)
    setTypes([])
    setMinGuests(1)
    setAmenities([])
  }

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-12">
        <span className="eyebrow text-wine">Our Rooms</span>
        <h1 className="font-display text-4xl md:text-6xl mt-3">Find your room</h1>
        {!loading && !error && (
          <p className="text-ink/60 mt-3 max-w-xl">
            {filtered.length} of {rooms.length} rooms match your filters.
          </p>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24 grid lg:grid-cols-[280px_1fr] gap-12">
        <aside className="lg:sticky lg:top-28 h-fit space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Filters</h2>
            <button onClick={resetFilters} className="text-xs text-wine underline">
              Reset
            </button>
          </div>

          <div>
            <label className="eyebrow text-ink/60 block mb-3">Max Price · ₹{maxPrice}</label>
            <input
              type="range"
              min={999}
              max={maxRoomPrice}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brass"
            />
          </div>

          <div>
            <p className="eyebrow text-ink/60 mb-3">Room Type</p>
            <div className="space-y-2">
              {ROOM_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={types.includes(t)}
                    onChange={() => toggle(types, setTypes, t)}
                    className="accent-brass"
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="eyebrow text-ink/60 block mb-3">Guests · {minGuests}+</label>
            <input
              type="range"
              min={1}
              max={6}
              value={minGuests}
              onChange={(e) => setMinGuests(Number(e.target.value))}
              className="w-full accent-brass"
            />
          </div>

          {allAmenities.length > 0 && (
            <div>
              <p className="eyebrow text-ink/60 mb-3">Amenities</p>
              <div className="space-y-2">
                {allAmenities.map((a) => (
                  <label key={a} className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.includes(a)}
                      onChange={() => toggle(amenities, setAmenities, a)}
                      className="accent-brass"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div>
          {loading && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-24 border border-dashed border-stone rounded-2xl">
              <p className="font-display text-2xl mb-2">Couldn't load rooms</p>
              <p className="text-ink/60 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24 border border-dashed border-stone rounded-2xl">
              <p className="font-display text-2xl mb-2">No rooms match those filters</p>
              <p className="text-ink/60 text-sm mb-6">Try widening your price range or guest count.</p>
              <button
                onClick={resetFilters}
                className="bg-brass text-ink font-semibold px-6 py-2.5 rounded-full text-sm"
              >
                Reset Filters
              </button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {filtered.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
