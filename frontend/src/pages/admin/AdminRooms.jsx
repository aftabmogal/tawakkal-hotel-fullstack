import { useEffect, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import Toast from '../../components/Toast'
import {
  addRoomImage, createRoom, deleteRoom, deleteRoomImage, getRooms, updateRoom,
} from '../../api/rooms'
import { getErrorMessage } from '../../api/client'

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Family']

const emptyForm = {
  name: '', room_type: 'Standard', description: '', guests: 2, bed_type: '',
  size: '', price_per_night: '', amenities: '', is_available: true,
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null) // null = closed, 'new' = add, or room id
  const [form, setForm] = useState(emptyForm)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = () => {
    setLoading(true)
    getRooms()
      .then(setRooms)
      .catch((err) => setToast({ tone: 'error', message: getErrorMessage(err) }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startAdd = () => {
    setForm(emptyForm)
    setEditingId('new')
  }

  const startEdit = (room) => {
    setForm({
      name: room.name,
      room_type: room.type,
      description: room.description || '',
      guests: room.guests,
      bed_type: room.bed || '',
      size: room.size || '',
      price_per_night: room.price,
      amenities: (room.amenities || []).join(', '),
      is_available: room.available,
    })
    setEditingId(room.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewImageUrl('')
  }

  const update = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: val }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      room_type: form.room_type,
      description: form.description,
      guests: Number(form.guests),
      bed_type: form.bed_type,
      size: form.size,
      price_per_night: Number(form.price_per_night),
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      is_available: form.is_available,
    }
    try {
      if (editingId === 'new') {
        await createRoom(payload)
        setToast({ tone: 'success', message: 'Room created.' })
      } else {
        await updateRoom(editingId, payload)
        setToast({ tone: 'success', message: 'Room updated.' })
      }
      cancelEdit()
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room? This cannot be undone.')) return
    try {
      await deleteRoom(id)
      setToast({ tone: 'success', message: 'Room deleted.' })
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handleAddImage = async () => {
    if (!newImageUrl.trim() || editingId === 'new') return
    try {
      await addRoomImage({ roomId: editingId, imageUrl: newImageUrl.trim() })
      setNewImageUrl('')
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteRoomImage(imageId)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const editingRoom = rooms.find((r) => r.id === editingId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Rooms</h1>
        <button
          onClick={startAdd}
          className="bg-brass hover:bg-brassSoft text-ink text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          + Add Room
        </button>
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="bg-white border border-stone rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="font-display text-xl">{editingId === 'new' ? 'New Room' : `Edit: ${editingRoom?.name}`}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Name</label>
              <input required value={form.name} onChange={update('name')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Type</label>
              <select value={form.room_type} onChange={update('room_type')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm">
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={update('description')}
              className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm resize-none" />
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Guests</label>
              <input required type="number" min={1} value={form.guests} onChange={update('guests')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Bed Type</label>
              <input value={form.bed_type} onChange={update('bed_type')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Size</label>
              <input value={form.size} onChange={update('size')} placeholder="150 sq ft"
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="eyebrow text-ink/60 block mb-1.5">Price / Night (₹)</label>
              <input required type="number" min={0} value={form.price_per_night} onChange={update('price_per_night')}
                className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm" />
            </div>
          </div>

          <div>
            <label className="eyebrow text-ink/60 block mb-1.5">Amenities (comma-separated)</label>
            <input value={form.amenities} onChange={update('amenities')} placeholder="Free Wi-Fi, Air Conditioning, TV"
              className="w-full bg-ivorySoft border border-stone rounded-lg px-4 py-2.5 text-sm" />
          </div>

          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_available} onChange={update('is_available')} className="accent-brass" />
            Available for booking
          </label>

          {editingId !== 'new' && (
            <div className="border-t border-stone pt-4">
              <p className="eyebrow text-ink/60 mb-2">Images</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {editingRoom?.rawImages?.map((img) => (
                  <div key={img.id} className="relative">
                    <img src={img.image} alt="" className="h-16 w-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute -top-2 -right-2 bg-wine text-ivory rounded-full w-5 h-5 text-xs leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Image URL"
                  className="flex-1 bg-ivorySoft border border-stone rounded-lg px-4 py-2 text-sm"
                />
                <button type="button" onClick={handleAddImage} className="text-sm border border-stone rounded-lg px-4 py-2">
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-brass hover:bg-brassSoft disabled:opacity-60 text-ink font-semibold px-6 py-2.5 rounded-full text-sm transition-colors">
              {saving ? 'Saving…' : 'Save Room'}
            </button>
            <button type="button" onClick={cancelEdit} className="text-sm text-ink/60 px-4">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-stone overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/50 border-b border-stone">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-5"><Skeleton className="h-32 w-full" /></td></tr>
            ) : rooms.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-ink/50">No rooms yet.</td></tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.id} className="border-b border-stone last:border-0">
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3">{r.type}</td>
                  <td className="px-5 py-3">₹{r.price}</td>
                  <td className="px-5 py-3">{r.guests}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.available ? 'bg-sage/20 text-sage' : 'bg-stone text-ink/50'}`}>
                      {r.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(r)} className="text-wine text-xs font-semibold mr-4">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="text-ink/40 text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
