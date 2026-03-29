import { describe, it, expect } from 'vitest'
import { calculateScore } from '@/lib/score'
import type { Question } from '@/types'

const makeQuestion = (correctIndex: number): Question => ({
  id: 'q1',
  text: 'Question?',
  options: ['A', 'B', 'C', 'D'],
  correctIndex,
})

describe('calculateScore', () => {
  describe('happy path', () => {
    it('returns 100 when all answers are correct', () => {
      const questions: Question[] = [
        makeQuestion(0),
        makeQuestion(2),
        makeQuestion(1),
      ]
      const answers = [0, 2, 1]
      expect(calculateScore(answers, questions)).toBe(100)
    })

    it('returns 0 when no answers are correct', () => {
      const questions: Question[] = [
        makeQuestion(0),
        makeQuestion(2),
        makeQuestion(1),
      ]
      const answers = [1, 0, 3]
      expect(calculateScore(answers, questions)).toBe(0)
    })

    it('returns rounded percentage for partial correct answers', () => {
      // 2 out of 3 correct = 66.67% → rounds to 67
      const questions: Question[] = [
        makeQuestion(0),
        makeQuestion(1),
        makeQuestion(2),
      ]
      const answers = [0, 1, 3]
      expect(calculateScore(answers, questions)).toBe(67)
    })

    it('returns 50 when exactly half are correct', () => {
      const questions: Question[] = [makeQuestion(0), makeQuestion(1)]
      const answers = [0, 3]
      expect(calculateScore(answers, questions)).toBe(50)
    })
  })

  describe('edge cases', () => {
    it('returns 0 when questions array is empty', () => {
      expect(calculateScore([], [])).toBe(0)
    })

    it('returns 100 for a single correct answer', () => {
      const questions: Question[] = [makeQuestion(2)]
      expect(calculateScore([2], questions)).toBe(100)
    })

    it('returns 0 for a single wrong answer', () => {
      const questions: Question[] = [makeQuestion(2)]
      expect(calculateScore([1], questions)).toBe(0)
    })
  })
})
