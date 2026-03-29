import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { ok } from '@/lib/api-response'

seedStore()

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get('topicId')

  let attempts = Array.from(store.quizAttempts.values())
  if (topicId) {
    attempts = attempts.filter(a => a.topicId === topicId)
  }

  attempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

  return ok(attempts)
}
