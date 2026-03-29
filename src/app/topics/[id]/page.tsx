import { Suspense } from 'react'
import NoteList from '@/components/notes/NoteList'
import StudyTimer from '@/components/timer/StudyTimer'
import QuizGenerator from '@/components/quiz/QuizGenerator'
import QuizHistory from '@/components/quiz/QuizHistory'
import { Separator } from '@/components/ui/separator'

export const metadata = { title: 'Topic — PLA' }

type Props = { params: Promise<{ id: string }> }

export default async function TopicDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
      <StudyTimer topicId={id} />
      <Separator />
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <NoteList topicId={id} />
      </Suspense>
      <Separator />
      <QuizGenerator topicId={id} />
      <QuizHistory topicId={id} />
    </main>
  )
}
