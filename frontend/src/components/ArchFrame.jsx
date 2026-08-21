/**
 * ArchFrame — the recurring visual signature across the site.
 * Crops an image into a horseshoe-arch silhouette, echoing the arched
 * doorways of Tawakkal's heritage architecture. Used for hero panels,
 * room cards, and gallery tiles — nowhere else, so it stays a mark
 * rather than a pattern.
 */
export default function ArchFrame({ src, alt, className = '', size = 'default' }) {
  const radiusClass = size === 'sm' ? 'arch-frame-sm' : 'arch-frame'
  return (
    <div className={`${radiusClass} ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    </div>
  )
}
