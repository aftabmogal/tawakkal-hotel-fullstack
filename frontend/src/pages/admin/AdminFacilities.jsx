import { useEffect, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import Toast from '../../components/Toast'
import { createFacility, deleteFacility, getFacilities, updateFacility } from '../../api/facilities'
import { getErrorMessage } from '../../api/client'

const emptyForm = { name: '', icon: '', description: '', category: 'hotel' }

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([getFacilities('hotel'), getFacilities('restaurant')])
      .then(([hotel, restaurant]) => setFacilities([...hotel, ...restaurant]))
      .catch((err) => setToast({ tone: 'error', message: getErrorMessage(err) }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await createFacility(form)
      setForm(emptyForm)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility?')) return
    try {
      await deleteFacility(id)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handleToggleCategory = async (f) => {
    try {
      await updateFacility(f.id, { category: f.category === 'hotel' ? 'restaurant' : 'hotel' })
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Facilities</h1>

      <form onSubmit={handleAdd} className="bg-white border border-stone rounded-2xl p-6 mb-8 grid sm:grid-cols-5 gap-3 items-end">
        <div>
          <label className="eyebrow text-ink/60 block mb-1.5">Icon</label>
          <input value={form.icon} onChange={update('icon')} placeholder="📶"
            className="w-full bg-ivorySoft border border-stone rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-1">
          <label className="eyebrow text-ink/60 block mb-1.5">Name</label>
          <input value={form.name} onChange={update('name')}
            className="w-full bg-ivorySoft border border-stone rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="eyebrow text-ink/60 block mb-1.5">Description</label>
          <input value={form.description} onChange={update('description')}
            className="w-full bg-ivorySoft border border-stone rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="eyebrow text-ink/60 block mb-1.5">Category</label>
          <select value={form.category} onChange={update('category')}
            className="w-full bg-ivorySoft border border-stone rounded-lg px-3 py-2 text-sm">
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>
        <button type="submit" disabled={saving} className="bg-brass text-ink font-semibold px-5 py-2 rounded-full text-sm disabled:opacity-60">
          {saving ? 'Adding…' : '+ Add'}
        </button>
      </form>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="bg-white rounded-2xl border border-stone overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink/50 border-b border-stone">
                <th className="px-5 py-3"></th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id} className="border-b border-stone last:border-0">
                  <td className="px-5 py-3 text-lg">{f.icon}</td>
                  <td className="px-5 py-3 font-medium">{f.name}</td>
                  <td className="px-5 py-3 text-ink/60">{f.description}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleToggleCategory(f)} className="text-xs px-2.5 py-1 rounded-full bg-stone text-ink/60">
                      {f.category}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(f.id)} className="text-ink/40 text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
