import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArchFrame from '../components/ArchFrame'
import QuickBookWidget from '../components/QuickBookWidget'
import RoomCard from '../components/RoomCard'
import Skeleton from '../components/Skeleton'
import usePageTitle from '../hooks/usePageTitle'
import { getRooms } from '../api/rooms'
import { getFacilities } from '../api/facilities'

const reviews = [
  {
    name: 'Regular Guest',
    quote:
      'The biryani comes out hot and generous, and the staff never make you feel rushed even on a busy night.',
    stay: 'Dine-in guest',
  },
  {
    name: 'Weekday Diner',
    quote:
      'Reliable, quick service and fair prices — our go-to for a family dinner in Kurla without any fuss.',
    stay: 'Home delivery guest',
  },
  {
    name: 'Overnight Guest',
    quote:
      'Room was clean and cool, front desk was helpful at check-in, and breakfast downstairs was convenient.',
    stay: 'AC Deluxe Room guest',
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
]

const FALLBACK_FACILITIES = [
  { name: 'Free Wi-Fi', icon: '📶' },
  { name: 'AC Rooms', icon: '❄️' },
  { name: 'Restaurant', icon: '🍽️' },
  { name: '24-Hour Front Desk', icon: '🛎️' },
]

export default function Home() {
  usePageTitle()
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [facilities, setFacilities] = useState(FALLBACK_FACILITIES)

  useEffect(() => {
    getRooms()
      .then((data) => setFeaturedRooms(data.slice(0, 3)))
      .catch(() => setFeaturedRooms([]))
      .finally(() => setRoomsLoading(false))
  }, [])

  useEffect(() => {
    Promise.all([getFacilities('hotel'), getFacilities('restaurant')])
      .then(([hotel, restaurant]) => {
        const combined = [...hotel, ...restaurant]
        if (combined.length) setFacilities(combined.slice(0, 8))
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80"
            alt="Tawakkal hotel exterior at dusk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 pb-16 pt-40">
          <div className="max-w-2xl">
            <span className="eyebrow text-brass">Bail Bazar, Kurla West · Mumbai</span>
            <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.05] mt-4">
              Hospitality you can <em className="italic text-brassSoft">put your trust in</em>
            </h1>
            <p className="text-ivory/80 mt-6 text-base md:text-lg max-w-lg">
              Tawakkal pairs comfortable AC rooms with a Kurla favorite for Mughlai, North
              Indian, Chinese and biryani — open daily, noon to 12:30 AM.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/rooms"
                className="bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Book Now
              </Link>
              <Link
                to="/rooms"
                className="border border-ivory/40 hover:border-ivory text-ivory font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Explore Rooms
              </Link>
            </div>
          </div>

          <div className="mt-12 max-w-4xl">
            <QuickBookWidget />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
        <ArchFrame
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80"
          alt="Tawakkal hotel lobby"
          className="h-[420px] w-full"
        />
        <div>
          <span className="eyebrow text-wine">About Tawakkal</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
            A name that means reliance — and a promise we keep daily
          </h2>
          <p className="text-ink/70 mt-5 leading-relaxed">
            Tawakkal is a neighborhood hotel and restaurant in Bail Bazar, Kurla West —
            known for fast, friendly service and a kitchen that keeps regulars coming back
            for the biryani. Thirteen AC rooms sit above the restaurant, so a hot meal is
            always just downstairs.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <p className="font-display text-3xl text-wine">13</p>
              <p className="text-xs text-ink/60 mt-1">AC Rooms</p>
            </div>
            <div>
              <p className="font-display text-3xl text-wine">4.0★</p>
              <p className="text-xs text-ink/60 mt-1">Dining Rating</p>
            </div>
            <div>
              <p className="font-display text-3xl text-wine">₹700</p>
              <p className="text-xs text-ink/60 mt-1">For Two, Approx.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="bg-ivorySoft py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="eyebrow text-wine">Featured Rooms</span>
              <h2 className="font-display text-4xl md:text-5xl mt-3">Where you'll stay</h2>
            </div>
            <Link to="/rooms" className="text-sm font-semibold text-wine hover:text-ink">
              View all rooms →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {roomsLoading
              ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
              : featuredRooms.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow text-wine">Facilities</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Everything you need, close by</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {facilities.map((f) => (
            <div
              key={f.name}
              className="border border-stone rounded-2xl p-6 text-center hover:border-brass transition-colors"
            >
              <span className="text-3xl">{f.icon}</span>
              <p className="text-sm mt-3 font-medium">{f.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESTAURANT */}
      <section className="bg-ink text-ivory py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="eyebrow text-brass">The Restaurant</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
              Mughlai, North Indian, Chinese &amp; biryani
            </h2>
            <p className="text-ivory/70 mt-5 leading-relaxed">
              Open to guests and neighbors alike, our kitchen is known locally for its
              biryani and tandoori dishes, alongside Chinese and Sichuan favorites. Dine in,
              order takeaway, or get it delivered.
            </p>
            <p className="text-sm text-ivory/60 mt-5">Open daily · 12:00 PM – 12:30 AM · ₹700 for two, approx.</p>
            <Link
              to="/restaurant"
              className="inline-block mt-6 bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              View Full Menu
            </Link>
          </div>
          <ArchFrame
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
            alt="Tawakkal restaurant dining room"
            className="h-[420px] w-full order-1 md:order-2"
          />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow text-wine">Guest Reviews</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">What guests tell us</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div key={r.name} className="bg-ivorySoft rounded-2xl p-8">
              <p className="text-brass text-lg mb-4">★★★★★</p>
              <p className="text-ink/80 leading-relaxed italic font-display text-lg">
                "{r.quote}"
              </p>
              <p className="text-sm text-ink/60 mt-5">{r.name} · {r.stay}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-ivorySoft py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="eyebrow text-wine">Gallery</span>
              <h2 className="font-display text-4xl md:text-5xl mt-3">A look inside</h2>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-wine hover:text-ink">
              View full gallery →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {gallery.map((src, i) => (
              <ArchFrame key={i} src={src} alt="Tawakkal hotel gallery" size="sm" className="h-56 w-full" />
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow text-wine">Location</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
            Bail Bazar, Kurla West — easy to find, easy to reach
          </h2>
          <p className="text-ink/70 mt-5 leading-relaxed">
            66A, Bail Bazar, Opposite Municipal Hospital, Kurla West, Mumbai – 400070. Close
            to Phoenix Marketcity Mall, with Sakinaka and Kurla well connected by road and
            rail.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden h-[360px]">
          <iframe
            title="Tawakkal Hotel location map"
            src="https://www.google.com/maps?q=Bail+Bazar,+Opposite+Municipal+Hospital,+Kurla+West,+Mumbai,+400070&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-wine text-ivory py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Questions before you book?</h2>
            <p className="text-ivory/70 mt-2">Our front desk answers within the hour, day or night.</p>
          </div>
          <Link
            to="/contact"
            className="bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3.5 rounded-full whitespace-nowrap transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
