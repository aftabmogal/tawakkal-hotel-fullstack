import { Link } from 'react-router-dom'
import ArchFrame from './ArchFrame'

export default function RoomCard({ room }) {
  return (
    <div className="group">
      <div className="relative">
        <ArchFrame src={room.image} alt={room.name} className="h-64 w-full" />
        {!room.available && (
          <span className="absolute top-4 right-4 bg-ink/85 text-ivory text-xs font-semibold px-3 py-1.5 rounded-full">
            Fully Booked
          </span>
        )}
      </div>

      <div className="mt-4 px-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl text-ink">{room.name}</h3>
          <p className="text-sm text-ink/60 whitespace-nowrap">
            <span className="text-lg font-semibold text-wine">₹{room.price}</span> / night
          </p>
        </div>

        <p className="text-sm text-ink/60 mt-1">
          {room.guests} Guest{room.guests > 1 ? 's' : ''} · {room.bed} · {room.size}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {room.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="text-xs bg-stone/50 text-ink/70 px-2.5 py-1 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <Link
            to={`/rooms/${room.id}`}
            className="flex-1 text-center border border-ink/20 hover:border-ink text-ink text-sm font-medium py-2.5 rounded-full transition-colors"
          >
            View Details
          </Link>
          <Link
            to={room.available ? `/booking/${room.id}` : '#'}
            aria-disabled={!room.available}
            className={`flex-1 text-center text-sm font-semibold py-2.5 rounded-full transition-colors ${
              room.available
                ? 'bg-brass hover:bg-brassSoft text-ink'
                : 'bg-stone text-ink/40 pointer-events-none'
            }`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
