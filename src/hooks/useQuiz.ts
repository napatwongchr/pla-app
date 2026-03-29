'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { quizApi } from '@/lib/api-client'

const attemptsKey = (topicId?: string) =>
  topicId ? ['quiz-attempts', topicId] : ['quiz-attempts']

export function useQuizAttempts(topicId?: string) {
  return useQuery({
    queryKey: attemptsKey(topicId),
    queryFn: () => quizApi.attempts(topicId),
  })
}

export function useGenerateQuiz(topicId: string) {
  return useMutation({
    mutationFn: () => quizApi.generate(topicId),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useSubmitQuiz(topicId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: number[] }) =>
      quizApi.submit(quizId, answers),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attemptsKey(topicId) })
      qc.invalidateQueries({ queryKey: ['review-queue'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
