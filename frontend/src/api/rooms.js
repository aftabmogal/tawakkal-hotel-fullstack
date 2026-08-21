import client from './client'

function normalizeRoom(r) {
  return {
    id: r.id,
    name: r.name,
    type: r.room_type,
    description: r.description,
    guests: r.guests,
    bed: r.bed_type,
    size: r.size,
    price: Number(r.price_per_night),
    amenities: r.amenities || [],
    available: r.is_available,
    image: r.cover_image,
    images: (r.images || []).map((img) => img.image).filter(Boolean),
    rawImages: r.images || [], // [{id, image, alt_text, order}] — needed to delete a specific image
  }
}

export async function getRooms(params = {}) {
  const { data } = await client.get('/rooms/', { params })
  const results = data.results ?? data
  return results.map(normalizeRoom)
}

export async function getRoom(id) {
  const { data } = await client.get(`/rooms/${id}/`)
  return normalizeRoom(data)
}

// --- Admin ---

export async function createRoom(payload) {
  const { data } = await client.post('/rooms/', payload)
  return normalizeRoom(data)
}

export async function updateRoom(id, payload) {
  const { data } = await client.patch(`/rooms/${id}/`, payload)
  return normalizeRoom(data)
}

export async function deleteRoom(id) {
  await client.delete(`/rooms/${id}/`)
}

export async function addRoomImage({ roomId, imageUrl, altText = '', order = 0 }) {
  const { data } = await client.post('/room-images/', {
    room: roomId,
    image_url: imageUrl,
    alt_text: altText,
    order,
  })
  return data
}

export async function deleteRoomImage(imageId) {
  await client.delete(`/room-images/${imageId}/`)
}
