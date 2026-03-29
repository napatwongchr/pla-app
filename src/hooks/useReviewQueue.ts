'use client'

import { useQuery } from '@tanstack/react-query'
import { reviewApi } from '@/lib/api-client'

export function useReviewQueue() {
  return useQuery({
    queryKey: ['review-queue'],
    queryFn: reviewApi.queue,
  })
}
