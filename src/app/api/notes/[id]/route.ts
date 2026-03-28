import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { ok, notFound, badRequest } from '@/lib/api-response'
import { countWords } from '@/lib/word-count'

type Context = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Context) {
  const { id } = await params
  const note = store.notes.get(id)
  if (!note) return notFound()

  let body: { content: string }
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  if (typeof body.content !== 'string') return badRequest('content is required')

  const now = new Date().toISOString()
  const updated = {
    ...note,
    content: body.content,
    wordCount: countWords(body.content),
    updatedAt: now,
  }

  store.notes.set(id, updated)

  const topic = store.topics.get(note.topicId)
  if (topic) store.topics.set(topic.id, { ...topic, updatedAt: now })

  return ok(updated)
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params
  const note = store.notes.get(id)
  if (!note) return notFound()

  store.notes.delete(id)

  const topic = store.topics.get(note.topicId)
  if (topic) {
    store.topics.set(topic.id, {
      ...topic,
      noteCount: Math.max(0, topic.noteCount - 1),
      updatedAt: new Date().toISOString(),
    })
  }

  return ok({ deleted: id })
}
