import { useEffect, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import Toast from '../../components/Toast'
import { getContactMessages, markMessageRead } from '../../api/contact'
import { getErrorMessage } from '../../api/client'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const load = () => {
    setLoading(true)
    getContactMessages()
      .then(setMessages)
      .catch((err) => setToast({ tone: 'error', message: getErrorMessage(err) }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleRead = async (msg) => {
    try {
      await markMessageRead(msg.id, !msg.is_read)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Contact Messages</h1>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : messages.length === 0 ? (
        <p className="text-ink/50 text-sm">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white border rounded-2xl p-6 flex justify-between gap-6 ${m.is_read ? 'border-stone' : 'border-brass'}`}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{m.name}</p>
                  {!m.is_read && (
                    <span className="text-xs bg-brass/20 text-brass px-2 py-0.5 rounded-full">New</span>
                  )}
                </div>
                <p className="text-xs text-ink/50 mt-0.5">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                <p className="text-sm text-ink/80 mt-3">{m.message}</p>
                <p className="text-xs text-ink/40 mt-2">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => toggleRead(m)}
                className="text-xs text-wine shrink-0 whitespace-nowrap"
              >
                Mark {m.is_read ? 'Unread' : 'Read'}
              </button>
            </div>
          ))}
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
