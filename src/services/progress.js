const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export async function getCurrentWeekProgress(userId) {
  const res = await fetch(`${API_URL}/progress/${userId}/current-week`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Could not load current week progress.')
  }

  return data.progress
}

export async function toggleProgressItem(userId, payload) {
  const res = await fetch(`${API_URL}/progress/${userId}/items`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Could not save progress update.')
  }

  return data.progress
}
