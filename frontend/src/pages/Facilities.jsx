import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArchFrame from '../components/ArchFrame'
import Skeleton from '../components/Skeleton'
import { getFacilities } from '../api/facilities'
import usePageTitle from '../hooks/usePageTitle'

export default function Facilities() {
  usePageTitle('Facilities')
  const [hotelFacilities, setHotelFacilities] = useState([])
  const [restaurantFacilities, setRestaurantFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getFacilities('hotel'), getFacilities('restaurant')])
      .then(([hotel, restaurant]) => {
        setHotelFacilities(hotel)
        setRestaurantFacilities(restaurant)
      })
      .catch(() => {
        setHotelFacilities([])
        setRestaurantFacilities([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="relative min-h-[45vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2000&q=80"
            alt="Tawakkal hotel room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 pb-14 pt-40">
          <span className="eyebrow text-brass">What's Included</span>
          <h1 className="font-display text-5xl md:text-7xl text-ivory mt-4">Facilities</h1>
          <p className="text-ivory/80 mt-4 max-w-xl">
            Everything you need for a comfortable stay, and a kitchen downstairs whenever
            you're hungry.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
        <div className="mb-14">
          <span className="eyebrow text-wine">At the Hotel</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">In every room</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {loading &&
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          {!loading && hotelFacilities.length === 0 && (
            <p className="text-ink/50 text-sm col-span-3">Facilities list coming soon.</p>
          )}
          {!loading &&
            hotelFacilities.map((f) => (
              <div key={f.id} className="border border-stone rounded-2xl p-7 hover:border-brass transition-colors">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-display text-xl mt-4">{f.name}</h3>
                <p className="text-sm text-ink/60 mt-2 leading-relaxed">{f.description}</p>
              </div>
            ))}
        </div>

        <div className="mb-14">
          <span className="eyebrow text-wine">At the Restaurant</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">However you'd like it</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          {!loading && restaurantFacilities.length === 0 && (
            <p className="text-ink/50 text-sm col-span-3">Facilities list coming soon.</p>
          )}
          {!loading &&
            restaurantFacilities.map((f) => (
              <div key={f.id} className="border border-stone rounded-2xl p-7 hover:border-brass transition-colors">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-display text-xl mt-4">{f.name}</h3>
                <p className="text-sm text-ink/60 mt-2 leading-relaxed">{f.description}</p>
              </div>
            ))}
        </div>
      </section>

      <section className="bg-ivorySoft py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <ArchFrame
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"
            alt="AC room at Tawakkal Hotel"
            className="h-[360px] w-full"
          />
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Have a question about your stay?</h2>
            <p className="text-ink/60 mt-3">
              Our front desk can confirm room type, availability, or anything else before you
              book.
            </p>
            <div className="flex flex-wrap gap-4 mt-7">
              <Link
                to="/rooms"
                className="bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3 rounded-full transition-colors"
              >
                View Rooms
              </Link>
              <Link
                to="/contact"
                className="border border-ink/20 hover:border-ink text-ink font-semibold px-7 py-3 rounded-full transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
