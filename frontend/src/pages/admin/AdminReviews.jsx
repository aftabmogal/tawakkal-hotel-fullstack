import { useEffect, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import Toast from '../../components/Toast'
import { getReviews, setReviewApproval } from '../../api/reviews'
import { getErrorMessage } from '../../api/client'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const load = () => {
    setLoading(true)
    getReviews()
      .then(setReviews)
      .catch((err) => setToast({ tone: 'error', message: getErrorMessage(err) }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSetApproval = async (id, approved) => {
    try {
      await setReviewApproval(id, approved)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Reviews</h1>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : reviews.length === 0 ? (
        <p className="text-ink/50 text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-stone rounded-2xl p-6 flex justify-between gap-6">
              <div>
                <p className="text-brass mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                <p className="text-sm text-ink/80">{r.comment}</p>
                <p className="text-xs text-ink/40 mt-2">
                  {r.guest_name || 'Guest'} · {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-center ${r.is_approved ? 'bg-sage/20 text-sage' : 'bg-stone text-ink/50'}`}>
                  {r.is_approved ? 'Approved' : 'Pending'}
                </span>
                {r.is_approved ? (
                  <button onClick={() => handleSetApproval(r.id, false)} className="text-xs text-wine">Reject</button>
                ) : (
                  <button onClick={() => handleSetApproval(r.id, true)} className="text-xs text-wine">Approve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
