import { store } from './store'
import { generateId } from './id'
import type { Topic, Note, ReviewSchedule } from '@/types'

export function seedStore() {
  if (store.topics.size > 0) return

  const now = new Date().toISOString()

  const topics: Topic[] = [
    {
      id: 'topic-1',
      title: 'TypeScript Fundamentals',
      description: 'Core concepts of TypeScript including types, interfaces, and generics.',
      noteCount: 2,
      totalStudyMinutes: 45,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-2',
      title: 'React Hooks',
      description: 'useState, useEffect, useCallback, useMemo, and custom hooks.',
      noteCount: 1,
      totalStudyMinutes: 30,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-3',
      title: 'Next.js App Router',
      description: 'File-based routing, layouts, server components, and API routes.',
      noteCount: 0,
      totalStudyMinutes: 0,
      createdAt: now,
      updatedAt: now,
    },
  ]

  const notes: Note[] = [
    {
      id: generateId(),
      topicId: 'topic-1',
      content: 'TypeScript is a statically typed superset of JavaScript. It adds optional type annotations and compiles to plain JavaScript. The type system helps catch bugs at compile time rather than runtime. Interfaces define the shape of objects, while type aliases can represent any type. Generics allow writing reusable code that works with multiple types.',
      wordCount: 52,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      topicId: 'topic-1',
      content: 'Union types combine multiple types with the | operator. Intersection types combine multiple types with the & operator. Type narrowing allows TypeScript to infer more specific types within conditional blocks. The never type represents values that never occur.',
      wordCount: 38,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      topicId: 'topic-2',
      content: 'useState returns a state value and a setter function. useEffect runs side effects after renders. The dependency array controls when the effect re-runs. useCallback memoizes functions to prevent unnecessary re-renders. useMemo memoizes expensive calculations.',
      wordCount: 37,
      createdAt: now,
      updatedAt: now,
    },
  ]

  for (const topic of topics) {
    store.topics.set(topic.id, topic)
    const schedule: ReviewSchedule = {
      topicId: topic.id,
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
    }
    store.reviewSchedules.set(topic.id, schedule)
  }

  for (const note of notes) {
    store.notes.set(note.id, note)
  }
}
