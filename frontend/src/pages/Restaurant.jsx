import { useEffect, useState } from 'react'
import ArchFrame from '../components/ArchFrame'
import Skeleton from '../components/Skeleton'
import { getMenu } from '../api/restaurant'
import usePageTitle from '../hooks/usePageTitle'

export default function Restaurant() {
  usePageTitle('Restaurant')
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMenu()
      .then((data) => setMenu(data))
      .catch(() => setMenu([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <section className="relative min-h-[55vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80"
            alt="Tawakkal restaurant dining room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 pb-14 pt-40">
          <span className="eyebrow text-brass">North Indian · Mughlai · Chinese · Biryani · Seafood</span>
          <h1 className="font-display text-5xl md:text-7xl text-ivory mt-4">The Restaurant</h1>
          <p className="text-ivory/80 mt-4 max-w-xl">
            Open daily, 12:00 PM – 12:30 AM · ₹700 for two, approx. · Dine-in, takeaway and
            home delivery available.
          </p>
        </div>
      </section>

      {/* Info strip */}
      <section className="bg-wine text-ivory">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="eyebrow text-brass mb-1">Address</p>
            <p>66A, Bail Bazar, Opp. Municipal Hospital, Kurla West, Mumbai – 400070</p>
          </div>
          <div>
            <p className="eyebrow text-brass mb-1">Phone</p>
            <p>+91 86551 16190</p>
          </div>
          <div>
            <p className="eyebrow text-brass mb-1">Hours</p>
            <p>12:00 PM – 12:30 AM, daily</p>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow text-wine">Menu</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">A taste of what we serve</h2>
          <p className="text-ink/60 mt-3 text-sm">
            Prices shown are indicative — please confirm current pricing at the restaurant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {loading &&
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}

          {!loading && menu.length === 0 && (
            <p className="text-ink/60 text-sm col-span-2 text-center">
              Menu is being updated — call us at +91 86551 16190 for today's offerings.
            </p>
          )}

          {!loading &&
            menu.map((category) => (
              <div key={category.id}>
                <h3 className="font-display text-2xl text-wine mb-4 pb-2 border-b border-stone">
                  {category.name}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-ink/80">
                        {item.name}
                        {!item.is_available && (
                          <span className="text-ink/40 ml-2 text-xs">(unavailable)</span>
                        )}
                      </span>
                      <span className="flex-1 border-b border-dotted border-stone mx-2 translate-y-[-3px]" />
                      <span className="text-sm font-semibold text-ink whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      {/* Gallery strip */}
      <section className="bg-ivorySoft py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="eyebrow text-wine">From the Kitchen</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3">A look at the food</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=800&q=80',
            ].map((src, i) => (
              <ArchFrame key={i} src={src} alt="Dish at Tawakkal Restaurant" size="sm" className="h-56 w-full" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl">Dine in, takeaway, or delivered to your door</h2>
        <p className="text-ink/60 mt-3">Call ahead for large groups or catering for special occasions.</p>
        <a
          href="tel:+918655116190"
          className="inline-block mt-8 bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3.5 rounded-full transition-colors"
        >
          Call +91 86551 16190
        </a>
      </section>
    </div>
  )
}
