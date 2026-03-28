'use client'

import { useStudyTimer } from '@/hooks/useStudyTimer'
import TimerDisplay from './TimerDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface StudyTimerProps {
  topicId: string
}

export default function StudyTimer({ topicId }: StudyTimerProps) {
  const { isRunning, elapsed, start, stop } = useStudyTimer(topicId)

  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <TimerDisplay elapsed={elapsed} />
        {isRunning ? (
          <Button variant="destructive" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button onClick={start}>Start Study Session</Button>
        )}
      </CardContent>
    </Card>
  )
}
