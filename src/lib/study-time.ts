import { store } from './store'

export function getTotalStudyMinutes(topicId: string): number {
  let total = 0
  for (const session of store.studySessions.values()) {
    if (session.topicId === topicId) total += session.durationMinutes
  }
  return total
}

export function getWeeklyStudyMinutes(topicId: string): number {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  let total = 0
  for (const session of store.studySessions.values()) {
    if (session.topicId === topicId && session.startedAt >= weekAgo) {
      total += session.durationMinutes
    }
  }
  return total
}
