import type { Topic, Note, StudySession, Quiz, QuizAttempt, ReviewSchedule, RateLimitEntry } from '@/types'

class Store {
  topics = new Map<string, Topic>()
  notes = new Map<string, Note>()
  studySessions = new Map<string, StudySession>()
  quizzes = new Map<string, Quiz>()
  quizAttempts = new Map<string, QuizAttempt>()
  reviewSchedules = new Map<string, ReviewSchedule>()
  rateLimits = new Map<string, RateLimitEntry>()
}

const globalStore = global as typeof global & { __store?: Store }

if (!globalStore.__store) {
  globalStore.__store = new Store()
}

export const store = globalStore.__store
