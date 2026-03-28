import type { Topic, CreateTopicInput, UpdateTopicInput } from '@/types'

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}

export const topicsApi = {
  list: () => fetchJSON<Topic[]>('/api/topics'),

  create: (input: CreateTopicInput) =>
    fetchJSON<Topic>('/api/topics', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  update: (id: string, input: UpdateTopicInput) =>
    fetchJSON<Topic>(`/api/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),

  delete: (id: string) =>
    fetchJSON<{ deleted: string }>(`/api/topics/${id}`, { method: 'DELETE' }),
}
