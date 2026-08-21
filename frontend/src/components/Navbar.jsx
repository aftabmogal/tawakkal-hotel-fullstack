import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/restaurant', label: 'Restaurant' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/95 backdrop-blur shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display italic text-2xl md:text-3xl text-ivory tracking-wide">
            Tawakkal
          </span>
          <span className="eyebrow text-brass hidden sm:inline">Restaurant &amp; Hotel</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? 'text-brass' : 'text-ivory/85 hover:text-brass'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className="text-sm text-ivory/85 hover:text-brass transition-colors"
              >
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-ivory/85 hover:text-brass transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm text-ivory/85 hover:text-brass transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            to="/rooms"
            className="bg-brass hover:bg-brassSoft text-ink text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Book Now
          </Link>
        </div>

        <button
          className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-ivory transition-transform ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span className={`block h-0.5 w-6 bg-ivory transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span
            className={`block h-0.5 w-6 bg-ivory transition-transform ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ink border-t border-ivory/10 px-5 pb-6 pt-2">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base py-1 ${isActive ? 'text-brass' : 'text-ivory/85'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-4 pt-2 border-t border-ivory/10">
              {user ? (
                <>
                  <Link to="/my-bookings" onClick={() => setOpen(false)} className="text-ivory/85 text-sm">
                    {user.name}
                  </Link>
                  <button onClick={handleLogout} className="text-ivory/85 text-sm">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="text-ivory/85 text-sm">
                  Sign In
                </Link>
              )}
              <Link
                to="/rooms"
                onClick={() => setOpen(false)}
                className="bg-brass text-ink text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                Book Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
