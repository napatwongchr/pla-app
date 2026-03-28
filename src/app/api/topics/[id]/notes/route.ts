import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { generateId } from '@/lib/id'
import { ok, notFound, badRequest } from '@/lib/api-response'
import { countWords } from '@/lib/word-count'
import type { Note, CreateNoteInput } from '@/types'

seedStore()

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params
  if (!store.topics.has(id)) return notFound()

  const notes = Array.from(store.notes.values())
    .filter((n) => n.topicId === id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return ok(notes)
}

export async function POST(request: NextRequest, { params }: Context) {
  const { id } = await params
  const topic = store.topics.get(id)
  if (!topic) return notFound()

  let body: CreateNoteInput
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  if (typeof body.content !== 'string') return badRequest('content is required')

  const now = new Date().toISOString()
  const note: Note = {
    id: generateId(),
    topicId: id,
    content: body.content,
    wordCount: countWords(body.content),
    createdAt: now,
    updatedAt: now,
  }

  store.notes.set(note.id, note)
  store.topics.set(id, { ...topic, noteCount: topic.noteCount + 1, updatedAt: now })

  return ok(note, 201)
}
