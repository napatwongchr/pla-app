import type { Quiz, Question, ReviewSchedule } from '@/types'

// ─── Reusable Question builders ──────────────────────────────────────────────

function makeQuestion(id: string, correctIndex: number): Question {
  return {
    id,
    text: `Question ${id}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex,
  }
}

// ─── Quiz fixtures ────────────────────────────────────────────────────────────

/** Standard 5-question quiz — correctIndex sequence: 1, 0, 2, 3, 1 */
export const quizWith5Questions: Quiz = {
  id: 'quiz-5q',
  topicId: 'topic-5q',
  generatedBy: 'rule-based',
  difficulty: 'medium',
  createdAt: '2026-03-29T00:00:00.000Z',
  questions: [
    makeQuestion('q1', 1),
    makeQuestion('q2', 0),
    makeQuestion('q3', 2),
    makeQuestion('q4', 3),
    makeQuestion('q5', 1),
  ],
}

/** Single-question quiz — correctIndex = 2 */
export const quizWith1Question: Quiz = {
  id: 'quiz-1q',
  topicId: 'topic-1q',
  generatedBy: 'rule-based',
  difficulty: 'easy',
  createdAt: '2026-03-29T00:00:00.000Z',
  questions: [makeQuestion('q1', 2)],
}

/** Empty quiz — 0 questions (edge case TC-E-01) */
export const quizWith0Questions: Quiz = {
  id: 'quiz-0q',
  topicId: 'topic-0q',
  generatedBy: 'rule-based',
  difficulty: 'easy',
  createdAt: '2026-03-29T00:00:00.000Z',
  questions: [],
}

/** 10-question quiz used for SM-2 boundary / grade testing */
export const quizWith10Questions: Quiz = {
  id: 'quiz-10q',
  topicId: 'topic-10q',
  generatedBy: 'rule-based',
  difficulty: 'hard',
  createdAt: '2026-03-29T00:00:00.000Z',
  questions: Array.from({ length: 10 }, (_, i) => makeQuestion(`q${i + 1}`, 0)),
}

// ─── ReviewSchedule fixtures ──────────────────────────────────────────────────

export const reviewScheduleDefault: ReviewSchedule = {
  topicId: 'topic-5q',
  nextReviewAt: '2026-04-04T00:00:00.000Z',
  intervalDays: 6,
  easeFactor: 2.5,
  repetitions: 1,
}

/** SM-2 stage 0 → 1 test (TC-E-05 stage 1) */
export const reviewScheduleStage0: ReviewSchedule = {
  topicId: 'topic-sm2',
  nextReviewAt: '2026-03-30T00:00:00.000Z',
  intervalDays: 1,
  easeFactor: 2.5,
  repetitions: 0,
}

/** SM-2 stage 1 → 2 test (TC-E-05 stage 2) */
export const reviewScheduleStage1: ReviewSchedule = {
  topicId: 'topic-sm2',
  nextReviewAt: '2026-04-04T00:00:00.000Z',
  intervalDays: 1,
  easeFactor: 2.5,
  repetitions: 1,
}

/** SM-2 stage 2 → 3 test (TC-E-05 stage 3) */
export const reviewScheduleStage2: ReviewSchedule = {
  topicId: 'topic-sm2',
  nextReviewAt: '2026-04-04T00:00:00.000Z',
  intervalDays: 6,
  easeFactor: 2.5,
  repetitions: 2,
}

/** Minimum easeFactor clamp test (TC-E-06) */
export const reviewScheduleMinEase: ReviewSchedule = {
  topicId: 'topic-min-ease',
  nextReviewAt: '2026-04-18T00:00:00.000Z',
  intervalDays: 20,
  easeFactor: 1.3,
  repetitions: 5,
}

// ─── Answer fixtures ──────────────────────────────────────────────────────────

/**
 * 1. Normal data — ตอบถูกทุกข้อ (TC-P-01 style, 5 questions)
 *    correctIndex sequence: 1, 0, 2, 3, 1
 */
export const answersAllCorrect5 = [1, 0, 2, 3, 1]

/**
 * 1. Normal data — ตอบถูกบางข้อ (TC-P-02 style, 5 questions)
 *    ถูก 3 ข้อ → score = Math.round(3/5 * 100) = 60
 */
export const answersPartialCorrect5 = [1, 0, 0, 0, 0]

/**
 * 2. Edge case — single question, ตอบถูก (TC-E-02)
 *    correctIndex = 2
 */
export const answersSingleCorrect = [2]

/**
 * 2. Edge case — single question, ตอบผิด (TC-E-03)
 */
export const answersSingleWrong = [0]

/**
 * 3. Invalid data — array ว่าง (TC-N-07 / TC-E-01)
 *    ใช้กับ quizWith5Questions → mismatch → HTTP 400
 *    ใช้กับ quizWith0Questions → valid → HTTP 201
 */
export const answersEmpty: number[] = []

/**
 * 3. Invalid data — น้อยกว่า questions (TC-N-07)
 *    ใช้กับ quizWith5Questions (5 questions) → HTTP 400
 */
export const answersTooFew = [0, 1]

/**
 * 3. Invalid data — มากกว่า questions (TC-N-08)
 *    ใช้กับ quizWith5Questions (5 questions) → HTTP 400
 */
export const answersTooMany = [0, 1, 2, 3, 4, 5]

/**
 * 4. Boundary — score = 0, ตอบผิดทุกข้อ (TC-P-03)
 *    quizWith5Questions correctIndex = [1,0,2,3,1] → ส่งค่าที่ไม่ตรงทุกข้อ
 */
export const answersAllWrong5 = [0, 1, 0, 0, 0]

/**
 * 4. Boundary — score = 100, ตอบถูกทุกข้อ (TC-P-01)
 *    alias ของ answersAllCorrect5 เพื่อความชัดเจนใน test
 */
export const answersScore100 = answersAllCorrect5

/**
 * 4. Boundary — score = 0 (TC-P-03)
 *    alias ของ answersAllWrong5
 */
export const answersScore0 = answersAllWrong5

// ─── Body fixtures (raw request bodies) ──────────────────────────────────────

/** 3. Invalid data — answers ไม่ใช่ array (TC-N-03) */
export const bodyAnswersString = { answers: '0,1,2,3,4' }

/** 3. Invalid data — answers เป็น number (TC-N-04) */
export const bodyAnswersNumber = { answers: 123 }

/** 3. Invalid data — answers เป็น null (TC-N-05) */
export const bodyAnswersNull = { answers: null }

/** 3. Invalid data — ไม่มี answers field (TC-N-06) */
export const bodyNoAnswers = {}

// ─── Expected score lookup (for assertion helpers) ───────────────────────────

/**
 * คำนวณ score ที่คาดหวังสำหรับ quizWith5Questions
 * correctIndex = [1, 0, 2, 3, 1]
 */
export const expectedScores = {
  allCorrect: 100,         // 5/5
  partialCorrect3of5: 60,  // 3/5 = Math.round(60) = 60
  allWrong: 0,             // 0/5
  singleCorrect: 100,      // 1/1
  singleWrong: 0,          // 0/1
  emptyQuiz: 0,            // 0/0 (calculateScore returns 0 for empty)
} as const
