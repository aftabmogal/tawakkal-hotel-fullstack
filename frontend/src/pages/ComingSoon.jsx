import { Link } from 'react-router-dom'

export default function ComingSoon({ title }) {
  return (
    <div className="pt-40 pb-32 max-w-2xl mx-auto px-5 text-center">
      <span className="eyebrow text-wine">Tawakkal</span>
      <h1 className="font-display text-4xl md:text-5xl mt-3">{title}</h1>
      <p className="text-ink/60 mt-4">
        This page is scheduled for the next build phase. Home and Rooms are live now.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 bg-brass hover:bg-brassSoft text-ink font-semibold px-7 py-3 rounded-full transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
