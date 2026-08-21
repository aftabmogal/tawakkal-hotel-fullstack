import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArchFrame from '../components/ArchFrame'
import RoomCard from '../components/RoomCard'
import Skeleton from '../components/Skeleton'
import usePageTitle from '../hooks/usePageTitle'
import { getRoom, getRooms } from '../api/rooms'
import { getErrorMessage } from '../api/client'

export default function RoomDetails() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  usePageTitle(room?.name || 'Room Details')
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setActiveImg(0)
    getRoom(id)
      .then(async (r) => {
        if (cancelled) return
        setRoom(r)
        setError('')
        try {
          const all = await getRooms({ room_type: r.type })
          if (!cancelled) setSimilar(all.filter((x) => x.id !== r.id).slice(0, 3))
        } catch {
          // similar rooms are a nice-to-have; ignore failures quietly
        }
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="pt-28 max-w-7xl mx-auto px-5 md:px-8 pb-16 grid lg:grid-cols-[1.3fr_1fr] gap-12">
        <Skeleton className="h-[380px] md:h-[460px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="pt-40 pb-32 max-w-lg mx-auto px-5 text-center">
        <span className="eyebrow text-wine">Tawakkal</span>
        <h1 className="font-display text-4xl mt-3">Room Not Found</h1>
        <p className="text-ink/60 mt-3">{error || 'This room may have been renamed or removed.'}</p>
        <Link
          to="/rooms"
          className="inline-block mt-8 bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3 rounded-full transition-colors"
        >
          Browse All Rooms
        </Link>
      </div>
    )
  }

  const images = room.images?.length ? room.images : [room.image].filter(Boolean)

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-16 grid lg:grid-cols-[1.3fr_1fr] gap-12">
        <div>
          <ArchFrame
            src={images[activeImg] || room.image}
            alt={room.name}
            className="h-[380px] md:h-[460px] w-full"
          />
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImg ? 'border-brass' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="eyebrow text-wine">{room.type} Room</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{room.name}</h1>
          {!room.available && (
            <span className="inline-block mt-3 bg-ink/85 text-ivory text-xs font-semibold px-3 py-1.5 rounded-full">
              Fully Booked
            </span>
          )}
          <p className="text-ink/70 mt-4 leading-relaxed">{room.description}</p>

          <dl className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div>
              <dt className="text-ink/50">Guests</dt>
              <dd className="font-semibold mt-0.5">{room.guests}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Bed</dt>
              <dd className="font-semibold mt-0.5">{room.bed}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Size</dt>
              <dd className="font-semibold mt-0.5">{room.size}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2 mt-6">
            {room.amenities.map((a) => (
              <span key={a} className="text-xs bg-stone/50 text-ink/70 px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>

          <div className="mt-8 border border-stone rounded-2xl p-6">
            <p className="text-xs text-ink/50 mb-3">Check-in 12:00 PM · Check-out 11:00 AM</p>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl text-wine">₹{room.price}</p>
              <p className="text-sm text-ink/50">per night</p>
            </div>
            <Link
              to={room.available ? `/booking/${room.id}` : '#'}
              aria-disabled={!room.available}
              className={`block text-center mt-4 font-semibold py-3 rounded-full transition-colors ${
                room.available
                  ? 'bg-brass hover:bg-brassSoft text-ink'
                  : 'bg-stone text-ink/40 pointer-events-none'
              }`}
            >
              {room.available ? 'Book Now' : 'Fully Booked'}
            </Link>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-ivorySoft py-20">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl mb-10">Similar Rooms</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {similar.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
