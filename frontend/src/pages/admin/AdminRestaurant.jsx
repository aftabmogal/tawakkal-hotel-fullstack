import { useEffect, useState } from 'react'
import Skeleton from '../../components/Skeleton'
import Toast from '../../components/Toast'
import {
  createCategory, createFoodItem, deleteCategory, deleteFoodItem, getMenu,
  updateCategory, updateFoodItem,
} from '../../api/restaurant'
import { getErrorMessage } from '../../api/client'

const emptyItemForm = { name: '', price: '', is_veg: true, is_available: true }

export default function AdminRestaurant() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [itemForms, setItemForms] = useState({}) // { [categoryId]: formState }

  const load = () => {
    setLoading(true)
    getMenu()
      .then(setMenu)
      .catch((err) => setToast({ tone: 'error', message: getErrorMessage(err) }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      await createCategory({ name: newCategoryName.trim(), order: menu.length })
      setNewCategoryName('')
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its items?')) return
    try {
      await deleteCategory(id)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const updateItemForm = (categoryId, key, value) => {
    setItemForms((f) => ({
      ...f,
      [categoryId]: { ...(f[categoryId] || emptyItemForm), [key]: value },
    }))
  }

  const handleAddItem = async (e, categoryId) => {
    e.preventDefault()
    const form = itemForms[categoryId] || emptyItemForm
    if (!form.name.trim() || !form.price) return
    try {
      await createFoodItem({
        category: categoryId,
        name: form.name.trim(),
        price: Number(form.price),
        is_veg: form.is_veg ?? true,
        is_available: form.is_available ?? true,
      })
      setItemForms((f) => ({ ...f, [categoryId]: emptyItemForm }))
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handleToggleAvailable = async (item) => {
    try {
      await updateFoodItem(item.id, { is_available: !item.is_available })
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handlePriceChange = async (item, price) => {
    try {
      await updateFoodItem(item.id, { price: Number(price) })
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      await deleteFoodItem(id)
      load()
    } catch (err) {
      setToast({ tone: 'error', message: getErrorMessage(err) })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Restaurant Menu</h1>

      <form onSubmit={handleAddCategory} className="flex gap-2 mb-8 max-w-md">
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="flex-1 bg-white border border-stone rounded-lg px-4 py-2.5 text-sm"
        />
        <button type="submit" className="bg-brass text-ink font-semibold px-5 py-2.5 rounded-full text-sm">
          Add Category
        </button>
      </form>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
      ) : (
        <div className="space-y-6">
          {menu.map((category) => {
            const form = itemForms[category.id] || emptyItemForm
            return (
              <div key={category.id} className="bg-white border border-stone rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl">{category.name}</h2>
                  <button onClick={() => handleDeleteCategory(category.id)} className="text-xs text-ink/40">
                    Delete Category
                  </button>
                </div>

                <ul className="space-y-2 mb-4">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 text-sm">
                      <span className="flex-1">{item.name}</span>
                      <input
                        type="number"
                        defaultValue={item.price}
                        onBlur={(e) => handlePriceChange(item, e.target.value)}
                        className="w-20 bg-ivorySoft border border-stone rounded-lg px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        className={`text-xs px-2.5 py-1 rounded-full ${item.is_available ? 'bg-sage/20 text-sage' : 'bg-stone text-ink/50'}`}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-ink/30 text-xs">✕</button>
                    </li>
                  ))}
                  {category.items.length === 0 && (
                    <li className="text-xs text-ink/40">No items in this category yet.</li>
                  )}
                </ul>

                <form onSubmit={(e) => handleAddItem(e, category.id)} className="flex flex-wrap gap-2">
                  <input
                    value={form.name}
                    onChange={(e) => updateItemForm(category.id, 'name', e.target.value)}
                    placeholder="Item name"
                    className="flex-1 min-w-[140px] bg-ivorySoft border border-stone rounded-lg px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateItemForm(category.id, 'price', e.target.value)}
                    placeholder="₹"
                    className="w-20 bg-ivorySoft border border-stone rounded-lg px-3 py-2 text-xs"
                  />
                  <button type="submit" className="text-xs border border-stone rounded-lg px-4 py-2">
                    + Add Item
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  )
}
