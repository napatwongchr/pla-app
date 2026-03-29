'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'
import { useGenerateQuiz, useSubmitQuiz } from '@/hooks/useQuiz'
import type { Quiz } from '@/types'

type Stage = 'idle' | 'quiz' | 'results'

interface Props {
  topicId: string
}

export default function QuizGenerator({ topicId }: Props) {
  const [stage, setStage] = useState<Stage>('idle')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [score, setScore] = useState<number>(0)

  const generate = useGenerateQuiz(topicId)
  const submit = useSubmitQuiz(topicId)

  async function handleGenerate() {
    const result = await generate.mutateAsync()
    setQuiz(result)
    setAnswers(new Array(result.questions.length).fill(null))
    setStage('quiz')
  }

  async function handleSubmit() {
    if (!quiz) return
    const filled = answers.map(a => (a === null ? 0 : a))
    const attempt = await submit.mutateAsync({ quizId: quiz.id, answers: filled })
    setScore(attempt.score)
    setAnswers(filled)
    setStage('results')
  }

  function handleRetry() {
    setQuiz(null)
    setAnswers([])
    setStage('idle')
  }

  const allAnswered = answers.length > 0 && answers.every(a => a !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {stage === 'idle' && (
          <Button onClick={handleGenerate} disabled={generate.isPending} className="w-full">
            {generate.isPending ? 'Generating…' : 'Generate Quiz'}
          </Button>
        )}

        {stage === 'quiz' && quiz && (
          <div className="space-y-6">
            {quiz.questions.map((q, i) => (
              <div key={q.id}>
                <QuizQuestion
                  question={q}
                  index={i}
                  selected={answers[i] ?? null}
                  onSelect={opt => {
                    const next = [...answers]
                    next[i] = opt
                    setAnswers(next)
                  }}
                />
                {i < quiz.questions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submit.isPending}
              className="w-full"
            >
              {submit.isPending ? 'Submitting…' : 'Submit'}
            </Button>
          </div>
        )}

        {stage === 'results' && quiz && (
          <QuizResults quiz={quiz} answers={answers as number[]} score={score} onRetry={handleRetry} />
        )}
      </CardContent>
    </Card>
  )
}
