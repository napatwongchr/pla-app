'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ReviewSchedule, Topic } from '@/types'

interface Props {
  schedule: ReviewSchedule
  topic: Topic | undefined
}

function daysOverdue(nextReviewAt: string): number {
  const diff = Date.now() - new Date(nextReviewAt).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function ReviewScheduleCard({ schedule, topic }: Props) {
  const overdue = daysOverdue(schedule.nextReviewAt)

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="space-y-1">
          <p className="font-medium">{topic?.title ?? schedule.topicId}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="destructive">
              {overdue === 0 ? 'Due today' : `${overdue}d overdue`}
            </Badge>
            <span>Interval: {schedule.intervalDays}d</span>
          </div>
        </div>
        <Link href={`/topics/${schedule.topicId}`} className={buttonVariants({ size: 'sm' })}>
          Review
        </Link>
      </CardContent>
    </Card>
  )
}
