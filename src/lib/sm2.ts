import type { ReviewSchedule } from '@/types'

export interface SM2Input {
  score: number
  schedule: ReviewSchedule
}

export interface SM2Output {
  nextReviewAt: string
  intervalDays: number
  easeFactor: number
  repetitions: number
}

function scoreToGrade(score: number): number {
  if (score >= 90) return 5
  if (score >= 80) return 4
  if (score >= 70) return 3
  if (score >= 60) return 2
  if (score >= 40) return 1
  return 0
}

export function calculateNextReview({ score, schedule }: SM2Input): SM2Output {
  const q = scoreToGrade(score)
  let { intervalDays, easeFactor, repetitions } = schedule

  // Update ease factor
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  if (q < 3) {
    // Reset on poor performance
    repetitions = 0
    intervalDays = 1
  } else {
    if (repetitions === 0) {
      intervalDays = 1
    } else if (repetitions === 1) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(intervalDays * easeFactor)
    }
    repetitions++
  }

  const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString()

  return { nextReviewAt, intervalDays, easeFactor, repetitions }
}
