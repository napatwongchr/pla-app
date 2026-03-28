import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { generateId } from '@/lib/id'
import { ok, notFound, badRequest } from '@/lib/api-response'
import { getTotalStudyMinutes } from '@/lib/study-time'
import type { StudySession } from '@/types'

export async function POST(request: NextRequest) {
  let body: { topicId: string; durationMinutes: number; startedAt: string; endedAt: string }
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  const { topicId, durationMinutes, startedAt, endedAt } = body

  if (!topicId) return badRequest('topicId is required')
  if (typeof durationMinutes !== 'number' || durationMinutes <= 0)
    return badRequest('durationMinutes must be a positive number')

  const topic = store.topics.get(topicId)
  if (!topic) return notFound()

  const session: StudySession = {
    id: generateId(),
    topicId,
    durationMinutes,
    startedAt: startedAt ?? new Date().toISOString(),
    endedAt: endedAt ?? new Date().toISOString(),
  }

  store.studySessions.set(session.id, session)

  const totalStudyMinutes = getTotalStudyMinutes(topicId)
  store.topics.set(topicId, { ...topic, totalStudyMinutes, updatedAt: new Date().toISOString() })

  return ok(session, 201)
}
