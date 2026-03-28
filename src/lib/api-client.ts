import type { Topic, Note, StudySession, CreateTopicInput, UpdateTopicInput, CreateNoteInput } from '@/types'

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

export const notesApi = {
  list: (topicId: string) => fetchJSON<Note[]>(`/api/topics/${topicId}/notes`),

  create: (topicId: string, input: CreateNoteInput) =>
    fetchJSON<Note>(`/api/topics/${topicId}/notes`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  update: (id: string, content: string) =>
    fetchJSON<Note>(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  delete: (id: string) =>
    fetchJSON<{ deleted: string }>(`/api/notes/${id}`, { method: 'DELETE' }),
}

export const studySessionsApi = {
  create: (body: {
    topicId: string
    durationMinutes: number
    startedAt: string
    endedAt: string
  }) =>
    fetchJSON<StudySession>('/api/study-sessions', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
