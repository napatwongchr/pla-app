'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuizAttempts } from '@/hooks/useQuiz'

interface Props {
  topicId: string
}

function scoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 70) return 'default'
  if (score >= 40) return 'secondary'
  return 'destructive'
}

export default function QuizHistory({ topicId }: Props) {
  const { data: attempts, isLoading } = useQuizAttempts(topicId)

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading history…</p>
  if (!attempts?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attempts.map(a => (
            <div key={a.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(a.completedAt).toLocaleDateString()}
              </span>
              <Badge variant={scoreBadgeVariant(a.score)}>{a.score}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
