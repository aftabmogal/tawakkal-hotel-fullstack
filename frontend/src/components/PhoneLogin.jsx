import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../api/client'

const RESEND_SECONDS = 30

export default function PhoneLogin({ onSuccess, compact = false }) {
  const { sendOtp, verifyOtp, setName } = useAuth()
  const [phase, setPhase] = useState('phone') // 'phone' | 'otp' | 'name'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setInterval(() => setResendIn((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await sendOtp(phone)
      setPhase('otp')
      setResendIn(RESEND_SECONDS)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await verifyOtp(phone, otp)
      if (result.isNewUser) {
        setPhase('name')
      } else {
        onSuccess?.(result)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveName = async (e) => {
    e.preventDefault()
    if (!nameInput.trim()) {
      setError('Enter your name.')
      return
    }
    setSubmitting(true)
    try {
      const updated = await setName(nameInput.trim())
      onSuccess?.(updated)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const wrap = compact ? '' : 'max-w-sm mx-auto'

  return (
    <div className={wrap}>
      {phase === 'phone' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Mobile Number</label>
            <div className="flex items-center gap-2 bg-ivory border border-stone rounded-lg px-4 focus-within:ring-2 focus-within:ring-brass">
              <span className="text-sm text-ink/50">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>
          {error && <p className="text-xs text-wine">{error}</p>}
          <button
            type="submit"
            disabled={submitting || phone.length !== 10}
            className="w-full bg-brass hover:bg-brassSoft disabled:opacity-50 text-ink font-semibold py-3 rounded-full transition-colors"
          >
            {submitting ? 'Sending…' : 'Send OTP'}
          </button>
        </form>
      )}

      {phase === 'otp' && (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-ink/60">
            Code sent to <span className="font-semibold text-ink">+91 {phone}</span>.{' '}
            <button
              type="button"
              onClick={() => {
                setPhase('phone')
                setOtp('')
              }}
              className="text-wine underline"
            >
              Change
            </button>
          </p>
          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit code"
              className="w-full bg-ivory border border-stone rounded-lg px-4 py-2.5 text-sm tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>
          {error && <p className="text-xs text-wine">{error}</p>}
          <button
            type="submit"
            disabled={submitting || otp.length !== 6}
            className="w-full bg-brass hover:bg-brassSoft disabled:opacity-50 text-ink font-semibold py-3 rounded-full transition-colors"
          >
            {submitting ? 'Verifying…' : 'Verify & Continue'}
          </button>
          <button
            type="button"
            disabled={resendIn > 0}
            onClick={handleSendOtp}
            className="w-full text-sm text-ink/60 disabled:text-ink/30"
          >
            {resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Resend OTP'}
          </button>
          <p className="text-xs text-ink/40 text-center">
            No SMS provider is connected yet — check the backend server console for your
            code.
          </p>
        </form>
      )}

      {phase === 'name' && (
        <form onSubmit={handleSaveName} className="space-y-4">
          <p className="text-sm text-ink/60">One last thing — what should we call you?</p>
          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Full Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-ivory border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>
          {error && <p className="text-xs text-wine">{error}</p>}
          <button
            type="submit"
            className="w-full bg-brass hover:bg-brassSoft text-ink font-semibold py-3 rounded-full transition-colors"
          >
            Continue
          </button>
        </form>
      )}
    </div>
  )
}
