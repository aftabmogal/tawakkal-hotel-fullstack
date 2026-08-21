import { useState } from 'react'
import Toast from '../components/Toast'
import { sendContactMessage } from '../api/contact'
import { getErrorMessage } from '../api/client'
import usePageTitle from '../hooks/usePageTitle'

const initialForm = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  usePageTitle('Contact')
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.message.trim()) errs.message = 'Enter a message.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      })
      setToast({ tone: 'success', message: "Message sent — we'll get back to you shortly." })
      setForm(initialForm)
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-16">
        <span className="eyebrow text-wine">Get in Touch</span>
        <h1 className="font-display text-4xl md:text-6xl mt-3">Contact Us</h1>
        <p className="text-ink/60 mt-3 max-w-xl">
          Questions about a room, the menu, or a large group? Reach us any of the ways below.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24 grid lg:grid-cols-[1fr_1.1fr] gap-16">
        {/* Info + map */}
        <div>
          <dl className="space-y-6 mb-10">
            <div>
              <dt className="eyebrow text-wine mb-1">Address</dt>
              <dd className="text-ink/80">
                66A, Bail Bazar, Opposite Municipal Hospital,<br />Kurla West, Mumbai – 400070
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-wine mb-1">Phone</dt>
              <dd className="text-ink/80">
                <a href="tel:+918655116190" className="hover:text-brass">+91 86551 16190</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-wine mb-1">Hours</dt>
              <dd className="text-ink/80">
                Restaurant: 12:00 PM – 12:30 AM, daily<br />Front desk: Open 24/7
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl overflow-hidden h-[320px]">
            <iframe
              title="Tawakkal Hotel location map"
              src="https://www.google.com/maps?q=Bail+Bazar,+Opposite+Municipal+Hospital,+Kurla+West,+Mumbai,+400070&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="bg-ivorySoft rounded-2xl p-8 md:p-10 h-fit">
          <h2 className="font-display text-2xl mb-6">Send a message</h2>

          <div className="space-y-5">
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                className="w-full bg-ivory border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              {errors.name && <p className="text-xs text-wine mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                className="w-full bg-ivory border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              {errors.email && <p className="text-xs text-wine mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                className="w-full bg-ivory border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
            </div>

            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={update('message')}
                className="w-full bg-ivory border border-stone rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass resize-none"
              />
              {errors.message && <p className="text-xs text-wine mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brass hover:bg-brassSoft disabled:opacity-60 text-ink font-semibold py-3 rounded-full transition-colors"
            >
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </section>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
