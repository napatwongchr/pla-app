import { store } from '@/lib/store'
import { seedStore } from '@/lib/seed'
import { ok } from '@/lib/api-response'

seedStore()

export async function GET() {
  const now = Date.now()

  const due = Array.from(store.reviewSchedules.values())
    .filter(s => new Date(s.nextReviewAt).getTime() <= now)
    .sort(
      (a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()
    )

  return ok(due)
}
