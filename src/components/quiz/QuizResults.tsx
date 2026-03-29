'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Quiz } from '@/types'

interface Props {
  quiz: Quiz
  answers: number[]
  score: number
  onRetry: () => void
}

export default function QuizResults({ quiz, answers, score, onRetry }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-4xl font-bold">{score}%</p>
        <p className="text-muted-foreground">
          {answers.filter((a, i) => a === quiz.questions[i].correctIndex).length} /{' '}
          {quiz.questions.length} correct
        </p>
        <Progress value={score} className="h-3" />
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctIndex
          return (
            <div
              key={q.id}
              className={`p-4 rounded-md border text-sm space-y-1 ${
                isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-400 bg-red-50 dark:bg-red-950/20'
              }`}
            >
              <p className="font-medium">
                {i + 1}. {q.text}
              </p>
              {!isCorrect && (
                <p className="text-muted-foreground">
                  Your answer: {q.options[answers[i]]}
                </p>
              )}
              <p className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Correct: {q.options[q.correctIndex]}
              </p>
            </div>
          )
        })}
      </div>

      <Button onClick={onRetry} variant="outline" className="w-full">
        Generate New Quiz
      </Button>
    </div>
  )
}
