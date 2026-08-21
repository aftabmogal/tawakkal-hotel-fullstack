import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory/80">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <span className="font-display italic text-2xl text-ivory">Tawakkal</span>
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            A boutique hotel and restaurant built on a simple idea: hospitality you can rely
            on, from the first booking to the last breakfast.
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-brass mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rooms" className="hover:text-brass">Rooms</Link></li>
            <li><Link to="/restaurant" className="hover:text-brass">Restaurant</Link></li>
            <li><Link to="/facilities" className="hover:text-brass">Facilities</Link></li>
            <li><Link to="/gallery" className="hover:text-brass">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-brass">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-brass mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>66A, Bail Bazar, Opp. Municipal Hospital,<br />Kurla West, Mumbai – 400070</li>
            <li>+91 86551 16190</li>
            <li>Restaurant: 12:00 PM – 12:30 AM daily</li>
            <li>Front desk open 24/7</li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-brass mb-4">Stay in Touch</h4>
          <p className="text-sm mb-4">Offers and seasonal menus, a few times a year.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 min-w-0 bg-ivory/10 border border-ivory/20 rounded-full px-4 py-2 text-sm placeholder:text-ivory/50 focus:outline-none focus:ring-2 focus:ring-brass"
            />
            <button className="bg-brass text-ink text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ivory/50">
          <span>© {new Date().getFullYear()} Tawakkal Restaurant &amp; Hotel. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-brass">Privacy</Link>
            <Link to="/contact" className="hover:text-brass">Terms</Link>
            <Link to="/admin" className="hover:text-brass">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
