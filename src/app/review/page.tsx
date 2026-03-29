import { Suspense } from 'react'
import ReviewQueue from '@/components/review/ReviewQueue'

export const metadata = { title: 'Review Queue — PLA' }

export default function ReviewPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Topics due for spaced-repetition review
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <ReviewQueue />
      </Suspense>
    </main>
  )
}
