import type { Question } from '@/types'

export function calculateScore(answers: number[], questions: Question[]): number {
  if (questions.length === 0) return 0
  const correct = answers.filter((a, i) => a === questions[i].correctIndex).length
  return Math.round((correct / questions.length) * 100)
}
