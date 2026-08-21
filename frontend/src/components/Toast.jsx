export default function Toast({ message, tone = 'success', onClose }) {
  if (!message) return null
  const toneClass = tone === 'error' ? 'bg-wine text-ivory' : 'bg-ink text-ivory'

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] ${toneClass} px-6 py-3 rounded-full shadow-soft text-sm flex items-center gap-3`}
    >
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="text-ivory/70 hover:text-ivory">
        ×
      </button>
    </div>
  )
}
