import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { generateId } from '@/lib/id'
import { ok, badRequest, notFound } from '@/lib/api-response'
import { calculateScore } from '@/lib/score'
import { calculateNextReview } from '@/lib/sm2'
import type { QuizAttempt } from '@/types'

seedStore()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const quiz = store.quizzes.get(id)
  if (!quiz) return notFound('Quiz not found')

  let body: { answers: number[] }
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  const { answers } = body
  if (!Array.isArray(answers)) return badRequest('answers must be an array')
  if (answers.length !== quiz.questions.length) {
    return badRequest(`Expected ${quiz.questions.length} answers, got ${answers.length}`)
  }

  const score = calculateScore(answers, quiz.questions)

  const attempt: QuizAttempt = {
    id: generateId(),
    quizId: quiz.id,
    topicId: quiz.topicId,
    answers,
    score,
    completedAt: new Date().toISOString(),
  }
  store.quizAttempts.set(attempt.id, attempt)

  // Update review schedule via SM-2
  const existing = store.reviewSchedules.get(quiz.topicId)
  if (existing) {
    const updated = calculateNextReview({ score, schedule: existing })
    store.reviewSchedules.set(quiz.topicId, {
      topicId: quiz.topicId,
      ...updated,
    })
  }

  return ok(attempt, 201)
}
