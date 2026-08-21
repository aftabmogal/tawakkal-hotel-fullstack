import ArchFrame from '../components/ArchFrame'
import usePageTitle from '../hooks/usePageTitle'

export default function About() {
  usePageTitle('About Us')
  return (
    <div>
      <section className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2000&q=80"
            alt="Tawakkal hotel lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full px-5 md:px-8 pb-14 pt-40">
          <span className="eyebrow text-brass">Kurla West, Mumbai</span>
          <h1 className="font-display text-5xl md:text-7xl text-ivory mt-4">About Tawakkal</h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow text-wine">Our Story</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
            A restaurant first, a hotel by necessity
          </h2>
          <p className="text-ink/70 mt-5 leading-relaxed">
            Tawakkal started as a restaurant in Bail Bazar, Kurla West — a spot known for its
            biryani and tandoori dishes long before it had a single guest room. As regulars
            kept asking for a place to stay nearby, thirteen AC rooms were added upstairs, so
            a good meal and a clean bed could be found under the same roof.
          </p>
          <p className="text-ink/70 mt-4 leading-relaxed">
            The name Tawakkal means reliance, or trust — the idea that hospitality should be
            something you can count on, whether you're stopping in for dinner or staying the
            night.
          </p>
        </div>
        <ArchFrame
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
          alt="Tawakkal restaurant interior"
          className="h-[420px] w-full"
        />
      </section>

      {/* Mission */}
      <section className="bg-ink text-ivory py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <ArchFrame
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"
            alt="AC room at Tawakkal"
            className="h-[380px] w-full order-2 md:order-1"
          />
          <div className="order-1 md:order-2">
            <span className="eyebrow text-brass">Our Mission</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
              Fast, honest hospitality — no fuss, no surprises
            </h2>
            <p className="text-ivory/70 mt-5 leading-relaxed">
              We keep it simple: clean AC rooms, a kitchen that doesn't cut corners, and
              staff who treat every guest like a regular. No hidden charges, no overselling —
              what you book is what you get.
            </p>
          </div>
        </div>
      </section>

      {/* Hospitality */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow text-wine">Hospitality</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">What guests can expect</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <span className="text-3xl">🛎️</span>
            <h3 className="font-display text-xl mt-4">Always Staffed</h3>
            <p className="text-sm text-ink/60 mt-2">
              Front desk is open around the clock — check in whenever you arrive.
            </p>
          </div>
          <div className="text-center">
            <span className="text-3xl">🍽️</span>
            <h3 className="font-display text-xl mt-4">A Meal Downstairs</h3>
            <p className="text-sm text-ink/60 mt-2">
              Room service or a table downstairs, whichever suits your evening.
            </p>
          </div>
          <div className="text-center">
            <span className="text-3xl">🤝</span>
            <h3 className="font-display text-xl mt-4">Fair Pricing</h3>
            <p className="text-sm text-ink/60 mt-2">
              Transparent room rates and a menu priced for regulars, not tourists.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ivorySoft py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display text-4xl md:text-5xl text-wine">13</p>
            <p className="text-xs md:text-sm text-ink/60 mt-2">AC Rooms</p>
          </div>
          <div>
            <p className="font-display text-4xl md:text-5xl text-wine">4.0★</p>
            <p className="text-xs md:text-sm text-ink/60 mt-2">Dining Rating</p>
          </div>
          <div>
            <p className="font-display text-4xl md:text-5xl text-wine">12:30 AM</p>
            <p className="text-xs md:text-sm text-ink/60 mt-2">Kitchen Closes Daily</p>
          </div>
        </div>
      </section>
    </div>
  )
}
