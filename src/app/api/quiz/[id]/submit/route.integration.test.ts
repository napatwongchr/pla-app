import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { store } from '@/lib/store'
import {
  quizWith5Questions,
  quizWith1Question,
  quizWith0Questions,
  reviewScheduleDefault,
  answersAllCorrect5,
  answersPartialCorrect5,
  answersAllWrong5,
  answersSingleCorrect,
  answersSingleWrong,
  answersEmpty,
  answersTooFew,
  answersTooMany,
  bodyAnswersString,
  bodyAnswersNumber,
  bodyAnswersNull,
  bodyNoAnswers,
  expectedScores,
} from '@/test/fixtures/quiz-submit.fixtures'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/quiz/test/submit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('POST /api/quiz/[id]/submit', () => {
  beforeEach(() => {
    store.quizzes.set(quizWith5Questions.id, quizWith5Questions)
    store.quizzes.set(quizWith1Question.id, quizWith1Question)
    store.quizzes.set(quizWith0Questions.id, quizWith0Questions)
    store.reviewSchedules.set(reviewScheduleDefault.topicId, { ...reviewScheduleDefault })
  })

  afterEach(() => {
    store.quizzes.delete(quizWith5Questions.id)
    store.quizzes.delete(quizWith1Question.id)
    store.quizzes.delete(quizWith0Questions.id)
    store.quizAttempts.clear()
    store.reviewSchedules.delete(reviewScheduleDefault.topicId)
  })

  // ─── Happy Path ──────────────────────────────────────────────────────────────

  describe('Happy Path — submit สำเร็จ', () => {
    it('TC-P-01: returns 201 + QuizAttempt เมื่อตอบถูกทุกข้อ (score=100)', async () => {
      const res = await POST(makeRequest({ answers: answersAllCorrect5 }), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.score).toBe(expectedScores.allCorrect)
      expect(body.quizId).toBe(quizWith5Questions.id)
      expect(body.topicId).toBe(quizWith5Questions.topicId)
      expect(body.answers).toEqual(answersAllCorrect5)
      expect(body.id).toBeDefined()
      expect(body.completedAt).toBeDefined()
    })

    it('TC-P-02: คำนวณ score บางส่วนถูก (2/5 = 40)', async () => {
      // answersPartialCorrect5 = [1,0,0,0,0], correctIndex = [1,0,2,3,1] → ถูก 2 ข้อ = 40
      const res = await POST(makeRequest({ answers: answersPartialCorrect5 }), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.score).toBe(40)
    })

    it('TC-P-03: score=0 เมื่อตอบผิดทุกข้อ', async () => {
      const res = await POST(makeRequest({ answers: answersAllWrong5 }), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.score).toBe(expectedScores.allWrong)
    })

    it('TC-P-04: บันทึก QuizAttempt ลง store.quizAttempts', async () => {
      const res = await POST(makeRequest({ answers: answersAllCorrect5 }), makeParams(quizWith5Questions.id))
      const body = await res.json()

      expect(store.quizAttempts.has(body.id)).toBe(true)
      const saved = store.quizAttempts.get(body.id)!
      expect(saved.score).toBe(expectedScores.allCorrect)
      expect(saved.quizId).toBe(quizWith5Questions.id)
    })

    it('TC-P-05: อัพเดต ReviewSchedule ผ่าน SM-2 เมื่อ topicId มี schedule อยู่แล้ว', async () => {
      const before = store.reviewSchedules.get(reviewScheduleDefault.topicId)!

      await POST(makeRequest({ answers: answersAllCorrect5 }), makeParams(quizWith5Questions.id))

      const after = store.reviewSchedules.get(reviewScheduleDefault.topicId)!
      expect(after.repetitions).toBeGreaterThan(before.repetitions)
      expect(after.nextReviewAt).not.toBe(before.nextReviewAt)
    })

    it('TC-P-06: ไม่ crash เมื่อ topicId ไม่มี ReviewSchedule (ข้ามการอัพเดต)', async () => {
      // quizWith1Question.topicId = 'topic-1q' — ไม่มีใน store
      const res = await POST(makeRequest({ answers: answersSingleCorrect }), makeParams(quizWith1Question.id))

      expect(res.status).toBe(201)
      expect(store.reviewSchedules.has('topic-1q')).toBe(false)
    })
  })

  // ─── Edge Cases ───────────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('TC-E-01: empty quiz (0 questions) + empty answers → 201, score=0', async () => {
      const res = await POST(makeRequest({ answers: answersEmpty }), makeParams(quizWith0Questions.id))

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.score).toBe(expectedScores.emptyQuiz)
    })

    it('TC-E-02: single question, ตอบถูก → score=100', async () => {
      const res = await POST(makeRequest({ answers: answersSingleCorrect }), makeParams(quizWith1Question.id))

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.score).toBe(expectedScores.singleCorrect)
    })

    it('TC-E-03: single question, ตอบผิด → score=0', async () => {
      const res = await POST(makeRequest({ answers: answersSingleWrong }), makeParams(quizWith1Question.id))

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.score).toBe(expectedScores.singleWrong)
    })
  })

  // ─── 404 Not Found ────────────────────────────────────────────────────────────

  describe('404 — quiz ไม่มีในระบบ', () => {
    it('TC-N-01: returns 404 เมื่อ quiz id ไม่มีใน store', async () => {
      const res = await POST(makeRequest({ answers: [0] }), makeParams('non-existent-id'))

      expect(res.status).toBe(404)
      const body = await res.json()
      expect(body.error).toBeDefined()
    })
  })

  // ─── 400 Bad Request ──────────────────────────────────────────────────────────

  describe('400 — answers ไม่ถูกต้อง', () => {
    it('TC-N-07: returns 400 เมื่อ answers น้อยกว่า questions (2 < 5)', async () => {
      const res = await POST(makeRequest({ answers: answersTooFew }), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toMatch(/5/)
    })

    it('TC-N-08: returns 400 เมื่อ answers มากกว่า questions (6 > 5)', async () => {
      const res = await POST(makeRequest({ answers: answersTooMany }), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toMatch(/5/)
    })

    it('TC-N-09: returns 400 เมื่อ answers เป็น empty array แต่ quiz มี 5 questions', async () => {
      const res = await POST(makeRequest({ answers: answersEmpty }), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toMatch(/5/)
    })

    it('TC-N-03: returns 400 เมื่อ answers เป็น string', async () => {
      const res = await POST(makeRequest(bodyAnswersString), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
    })

    it('TC-N-04: returns 400 เมื่อ answers เป็น number', async () => {
      const res = await POST(makeRequest(bodyAnswersNumber), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
    })

    it('TC-N-05: returns 400 เมื่อ answers เป็น null', async () => {
      const res = await POST(makeRequest(bodyAnswersNull), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
    })

    it('TC-N-06: returns 400 เมื่อไม่มี field answers', async () => {
      const res = await POST(makeRequest(bodyNoAnswers), makeParams(quizWith5Questions.id))

      expect(res.status).toBe(400)
    })
  })
})
