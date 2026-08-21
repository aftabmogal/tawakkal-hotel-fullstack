import { useLocation, useNavigate } from 'react-router-dom'
import PhoneLogin from '../components/PhoneLogin'
import usePageTitle from '../hooks/usePageTitle'

export default function Login() {
  usePageTitle('Sign In')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSuccess = (user) => {
    const from = location.state?.from
    if (from) {
      navigate(from, { replace: true })
    } else if (user?.is_staff) {
      navigate('/admin', { replace: true })
    } else {
      navigate('/my-bookings', { replace: true })
    }
  }

  return (
    <div className="pt-32 pb-24 min-h-[70vh] flex items-center">
      <div className="max-w-md mx-auto w-full px-5">
        <div className="text-center mb-8">
          <span className="eyebrow text-wine">Tawakkal Account</span>
          <h1 className="font-display text-4xl mt-3">Sign In</h1>
          <p className="text-ink/60 mt-2 text-sm">
            We use your mobile number — no passwords to remember.
          </p>
        </div>

        <PhoneLogin onSuccess={handleSuccess} />

        <p className="text-center text-xs text-ink/40 mt-8">
          Hotel staff — sign in with your staff phone number and you'll be taken straight
          to the{' '}
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-wine underline"
          >
            admin dashboard
          </button>
          .
        </p>
      </div>
    </div>
  )
}
