import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/rooms', label: 'Rooms' },
  { to: '/admin/facilities', label: 'Facilities' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/restaurant', label: 'Restaurant' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/messages', label: 'Messages' },
]

export default function AdminLayout() {
  const { user, ready, isAdmin } = useAuth()
  const location = useLocation()

  if (!ready) return null

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (!isAdmin) {
    return (
      <div className="pt-40 pb-32 max-w-md mx-auto px-5 text-center">
        <span className="eyebrow text-wine">Tawakkal Admin</span>
        <h1 className="font-display text-3xl mt-3">Staff Access Only</h1>
        <p className="text-ink/60 mt-3">
          This account doesn't have admin access. Sign in with a staff account to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen flex flex-col md:flex-row bg-ivorySoft">
      <aside className="md:w-56 shrink-0 bg-ink text-ivory md:min-h-[calc(100vh-5rem)]">
        <div className="px-6 py-6">
          <p className="font-display text-xl">Admin Panel</p>
          <p className="text-xs text-ivory/50 mt-1">{user.name || user.phone}</p>
        </div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-3 pb-4 md:pb-6 gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-brass text-ink font-semibold' : 'text-ivory/80 hover:bg-ivory/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-5 md:px-10 py-8">
        <Outlet />
      </main>
    </div>
  )
}
