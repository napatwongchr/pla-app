import { type NextRequest } from 'next/server'
import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { generateId } from '@/lib/id'
import { ok, badRequest, notFound } from '@/lib/api-response'
import { generateRuleBasedQuiz, InsufficientContentError } from '@/lib/quiz-generator'

seedStore()

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get('topicId')
  if (!topicId) return badRequest('topicId is required')

  const topic = store.topics.get(topicId)
  if (!topic) return notFound('Topic not found')

  const notes = Array.from(store.notes.values()).filter(n => n.topicId === topicId)

  try {
    const quizId = generateId()
    const quiz = generateRuleBasedQuiz(notes, quizId)
    store.quizzes.set(quiz.id, quiz)
    return ok(quiz)
  } catch (e) {
    if (e instanceof InsufficientContentError) {
      return badRequest(e.message)
    }
    throw e
  }
}
