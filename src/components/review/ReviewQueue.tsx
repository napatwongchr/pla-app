'use client'

import { useReviewQueue } from '@/hooks/useReviewQueue'
import { useTopics } from '@/hooks/useTopics'
import ReviewScheduleCard from './ReviewScheduleCard'

export default function ReviewQueue() {
  const { data: queue, isLoading: loadingQueue } = useReviewQueue()
  const { data: topics } = useTopics()

  if (loadingQueue) return <p className="text-muted-foreground">Loading review queue…</p>

  if (!queue?.length) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No topics due for review. Keep up the good work!
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {queue.map(schedule => (
        <ReviewScheduleCard
          key={schedule.topicId}
          schedule={schedule}
          topic={topics?.find(t => t.id === schedule.topicId)}
        />
      ))}
    </div>
  )
}
