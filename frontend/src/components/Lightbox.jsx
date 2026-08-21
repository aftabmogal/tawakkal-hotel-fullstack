import { useEffect } from 'react'

export default function Lightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNav])

  if (index === null) return null
  const current = images[index]

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute top-6 right-6 text-ivory text-3xl leading-none hover:text-brass"
      >
        ×
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNav(-1)
        }}
        aria-label="Previous image"
        className="absolute left-3 md:left-8 text-ivory text-4xl hover:text-brass"
      >
        ‹
      </button>

      <img
        src={current.src}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
      />

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNav(1)
        }}
        aria-label="Next image"
        className="absolute right-3 md:right-8 text-ivory text-4xl hover:text-brass"
      >
        ›
      </button>

      <p className="absolute bottom-6 text-ivory/70 text-sm">
        {index + 1} / {images.length}
      </p>
    </div>
  )
}
