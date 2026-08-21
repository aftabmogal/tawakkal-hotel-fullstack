import { useEffect } from 'react'

const SITE_NAME = 'Tawakkal Restaurant & Hotel'

/**
 * Sets document.title for the current page. This is a client-rendered SPA,
 * so these titles won't be visible to crawlers that don't execute JS —
 * for full SEO, consider pre-rendering or SSR (e.g. Vite SSR, Next.js)
 * before launch.
 */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME
  }, [title])
}
