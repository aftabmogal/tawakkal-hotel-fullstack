import { useState } from 'react'
import Lightbox from '../components/Lightbox'
import usePageTitle from '../hooks/usePageTitle'

const categories = {
  Exterior: [
    { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', alt: 'Hotel exterior at dusk' },
    { src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', alt: 'Street view near Bail Bazar' },
  ],
  Lobby: [
    { src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80', alt: 'Hotel lobby' },
    { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', alt: 'Reception area' },
  ],
  Rooms: [
    { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80', alt: 'AC Standard Room' },
    { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', alt: 'AC Deluxe Room' },
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', alt: 'Non-AC Standard Room' },
  ],
  Restaurant: [
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', alt: 'Restaurant dining room' },
    { src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80', alt: 'Restaurant seating' },
  ],
  Food: [
    { src: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1200&q=80', alt: 'Biryani' },
    { src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80', alt: 'Tandoori dishes' },
    { src: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80', alt: 'Chinese noodles' },
    { src: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=1200&q=80', alt: 'Curry dish' },
  ],
}

const allImages = Object.values(categories).flat()

export default function Gallery() {
  usePageTitle('Gallery')
  const [activeIndex, setActiveIndex] = useState(null)

  const openAt = (img) => setActiveIndex(allImages.findIndex((i) => i.src === img.src))
  const close = () => setActiveIndex(null)
  const nav = (dir) =>
    setActiveIndex((i) => (i + dir + allImages.length) % allImages.length)

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <span className="eyebrow text-wine">Gallery</span>
        <h1 className="font-display text-4xl md:text-6xl mt-3">A look inside Tawakkal</h1>
        <p className="text-ink/60 mt-3 max-w-xl">
          Tap any photo for a closer look — from the rooms upstairs to the kitchen
          downstairs.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24 space-y-16">
        {Object.entries(categories).map(([label, images]) => (
          <div key={label}>
            <h2 className="font-display text-2xl md:text-3xl mb-5">{label}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {images.map((img) => (
                <button
                  key={img.src}
                  onClick={() => openAt(img)}
                  className="arch-frame-sm h-52 w-full overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Lightbox images={allImages} index={activeIndex} onClose={close} onNav={nav} />
    </div>
  )
}
