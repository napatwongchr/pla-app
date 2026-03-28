import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { ok, notFound, badRequest } from '@/lib/api-response'
import type { UpdateTopicInput } from '@/types'

seedStore()

type Context = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Context) {
  const { id } = await params
  const topic = store.topics.get(id)
  if (!topic) return notFound()

  let body: UpdateTopicInput
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  const updated = {
    ...topic,
    ...(body.title !== undefined && { title: body.title.trim() }),
    ...(body.description !== undefined && { description: body.description.trim() }),
    updatedAt: new Date().toISOString(),
  }

  if (!updated.title) return badRequest('title cannot be empty')

  store.topics.set(id, updated)
  return ok(updated)
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params
  if (!store.topics.has(id)) return notFound()

  store.topics.delete(id)
  store.reviewSchedules.delete(id)

  // cascade-delete notes
  for (const [noteId, note] of store.notes) {
    if (note.topicId === id) store.notes.delete(noteId)
  }

  return ok({ deleted: id })
}
