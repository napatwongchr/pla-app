'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { topicsApi } from '@/lib/api-client'
import type { CreateTopicInput, UpdateTopicInput } from '@/types'

const TOPICS_KEY = ['topics'] as const

export function useTopics() {
  return useQuery({
    queryKey: TOPICS_KEY,
    queryFn: topicsApi.list,
  })
}

export function useCreateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTopicInput) => topicsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOPICS_KEY })
      toast.success('Topic created')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTopicInput }) =>
      topicsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOPICS_KEY })
      toast.success('Topic updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => topicsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOPICS_KEY })
      toast.success('Topic deleted')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
