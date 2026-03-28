export interface Topic {
  id: string
  title: string
  description: string
  noteCount: number
  totalStudyMinutes: number
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  topicId: string
  content: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface StudySession {
  id: string
  topicId: string
  durationMinutes: number
  startedAt: string
  endedAt: string
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

export interface Quiz {
  id: string
  topicId: string
  questions: Question[]
  generatedBy: 'rule-based' | 'claude-api'
  difficulty: QuizDifficulty
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  topicId: string
  answers: number[]
  score: number
  completedAt: string
}

export interface ReviewSchedule {
  topicId: string
  nextReviewAt: string
  intervalDays: number
  easeFactor: number
  repetitions: number
}

export interface RateLimitEntry {
  clientId: string
  count: number
  windowStart: string
}

// Input types
export interface CreateTopicInput {
  title: string
  description: string
}

export interface UpdateTopicInput {
  title?: string
  description?: string
}

export interface CreateNoteInput {
  content: string
}

export type QuizMode = 'rule-based' | 'ai'
export type QuizDifficulty = 'easy' | 'medium' | 'hard'
