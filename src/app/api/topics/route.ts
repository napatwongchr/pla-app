import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { generateId } from '@/lib/id'
import { ok, err, badRequest } from '@/lib/api-response'
import type { Topic, CreateTopicInput } from '@/types'

seedStore()

export async function GET() {
  const topics = Array.from(store.topics.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  return ok(topics)
}

export async function POST(request: NextRequest) {
  let body: CreateTopicInput
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  const { title, description } = body
  if (!title?.trim()) return badRequest('title is required')

  const now = new Date().toISOString()
  const topic: Topic = {
    id: generateId(),
    title: title.trim(),
    description: description?.trim() ?? '',
    noteCount: 0,
    totalStudyMinutes: 0,
    createdAt: now,
    updatedAt: now,
  }

  store.topics.set(topic.id, topic)

  const schedule = {
    topicId: topic.id,
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
  }
  store.reviewSchedules.set(topic.id, schedule)

  return ok(topic, 201)
}
