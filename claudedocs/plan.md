# PLA — Implementation Plan (Phase 1 Prototype)

> Source: `claudedocs/prd.md` | Status: Phase 2 Complete — Phase 3 In Progress

---

## Phase 1 — Project Scaffolding & Foundation

**Goal:** Runnable Next.js app with types, shared utilities, and in-memory store.

### Setup
- [x] Scaffold: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [x] Install deps: `@tanstack/react-query`, `@anthropic-ai/sdk`, `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `jsdom`
- [x] Init Shadcn: `npx shadcn@latest init` + add `button card dialog input textarea badge progress toast separator`

### Files
- [x] `vitest.config.ts` — jsdom environment + `@/*` alias
- [x] `src/test/setup.ts` — `import '@testing-library/jest-dom'`
- [ ] `.env.local` — `ANTHROPIC_API_KEY=...` (never commit)
- [x] `src/types/index.ts` — All 7 PRD interfaces + input types (`CreateTopicInput`, `UpdateTopicInput`, `CreateNoteInput`, `QuizMode`, `QuizDifficulty`, `RateLimitEntry`)
- [x] `src/lib/id.ts` — `generateId()` via `crypto.randomUUID()`
- [x] `src/lib/store.ts` — Singleton `Map<string, T>` store for all entities
- [x] `src/lib/seed.ts` — 2–3 sample topics + notes for dev use
- [x] `src/lib/api-response.ts` — `ok()`, `err()`, `notFound()`, `badRequest()` helpers

### Done when
- [ ] `npm run dev` → app loads at `localhost:3000`
- [ ] `npx tsc --noEmit` passes with `strict: true`

---

## Phase 2 — F01: Topic Manager

**Goal:** Full CRUD for topics via API routes + UI.

### API Routes
- [x] `GET /api/topics` — list all, sorted by `updatedAt` desc
- [x] `POST /api/topics` — create topic + default `ReviewSchedule`
- [x] `PUT /api/topics/[id]` — update title/description
- [x] `DELETE /api/topics/[id]` — remove topic + cascade-delete its notes

### Files
- [x] `src/app/api/topics/route.ts`
- [x] `src/app/api/topics/[id]/route.ts`
- [x] `src/lib/query-client.ts` — TanStack `QueryClient` singleton
- [x] `src/lib/api-client.ts` — typed fetch wrappers (`topicsApi`)
- [x] `src/app/layout.tsx` — `QueryClientProvider` + `Toaster`
- [x] `src/app/page.tsx` — redirect to `/topics`
- [x] `src/app/topics/page.tsx` — topic list page
- [x] `src/components/topics/TopicCard.tsx`
- [x] `src/components/topics/TopicForm.tsx`
- [x] `src/components/topics/TopicList.tsx`
- [x] `src/hooks/useTopics.ts` — `useQuery` + mutations with cache invalidation
- [x] `src/components/providers.tsx` — `QueryClientProvider` + `Toaster` wrapper

### Done when
- [x] Create topic → appears in list
- [x] Edit topic → updates in place
- [x] Delete topic → removed (notes also gone)
- [x] List sorted by `updatedAt` descending

---

## Phase 3 — F02: Note Editor + Study Timer

**Goal:** Notes CRUD per topic; study timer that persists across page refresh.

### API Routes
- [x] `GET /api/topics/[id]/notes` — notes for topic
- [x] `POST /api/topics/[id]/notes` — create note, update `topic.noteCount`
- [x] `PUT /api/notes/[id]` — update content + `wordCount`
- [x] `DELETE /api/notes/[id]` — remove note, decrement `topic.noteCount`
- [x] `POST /api/study-sessions` — record session, recalculate `topic.totalStudyMinutes`

### Files
- [x] `src/lib/word-count.ts` — `countWords(text): number`
- [x] `src/lib/study-time.ts` — `getTotalStudyMinutes()`, `getWeeklyStudyMinutes()`
- [x] `src/app/api/topics/[id]/notes/route.ts`
- [x] `src/app/api/notes/[id]/route.ts`
- [x] `src/app/api/study-sessions/route.ts`
- [x] `src/components/notes/NoteEditor.tsx` — textarea + auto-save + word count
- [x] `src/components/notes/NoteList.tsx`
- [x] `src/components/timer/StudyTimer.tsx` — Start/Stop button + elapsed display
- [x] `src/components/timer/TimerDisplay.tsx` — `HH:MM:SS` formatter
- [x] `src/hooks/useNotes.ts` — 30s debounce auto-save
- [x] `src/hooks/useStudyTimer.ts` — `localStorage` persistence
- [x] `src/app/topics/[id]/page.tsx` — topic detail with notes + timer

### Timer localStorage Shape
```json
{ "topicId": "...", "startedAt": "2026-03-28T10:00:00.000Z", "isRunning": true }
```

### Done when
- [x] Add note → auto-saves after 30s inactivity; shows "Saving..." → "Saved ✓"
- [x] Word count updates on every keystroke
- [x] Start timer → refresh page → timer resumes from correct elapsed time
- [x] Stop timer → `totalStudyMinutes` updates on topic list

---

## Phase 4 — F03: Smart Quiz & Review System (Rule-Based)

**Goal:** Rule-based quiz generation from notes; SM-2 spaced repetition after each attempt.

### API Routes
- [ ] `GET /api/quiz/generate` — generate rule-based quiz (`?topicId=`)
- [ ] `POST /api/quiz/[id]/submit` — score answers + update `ReviewSchedule` via SM-2
- [ ] `GET /api/quiz/attempts` — attempt history (optional `?topicId=`)
- [ ] `GET /api/review/queue` — topics where `nextReviewAt <= now`, most overdue first

### Files
- [ ] `src/lib/quiz-generator.ts` — `generateRuleBasedQuiz(notes, quizId)`, `InsufficientContentError`
- [ ] `src/lib/sm2.ts` — `calculateNextReview(input): SM2Output`
- [ ] `src/lib/score.ts` — `calculateScore(answers, questions): number`
- [ ] `src/app/api/quiz/generate/route.ts`
- [ ] `src/app/api/quiz/[id]/submit/route.ts`
- [ ] `src/app/api/quiz/attempts/route.ts`
- [ ] `src/app/api/review/queue/route.ts`
- [ ] `src/components/quiz/QuizGenerator.tsx`
- [ ] `src/components/quiz/QuizQuestion.tsx`
- [ ] `src/components/quiz/QuizResults.tsx`
- [ ] `src/components/quiz/QuizHistory.tsx`
- [ ] `src/components/review/ReviewQueue.tsx`
- [ ] `src/components/review/ReviewScheduleCard.tsx`
- [ ] `src/hooks/useQuiz.ts`
- [ ] `src/hooks/useReviewQueue.ts`
- [ ] `src/app/review/page.tsx`

### SM-2 Score Mapping
| Score | Grade (q) | Effect |
|-------|-----------|--------|
| 0–39 | 0 | Reset interval to 1 day |
| 40–59 | 1 | Reset |
| 60–69 | 2 | Reset |
| 70–79 | 3 | Grow interval |
| 80–89 | 4 | Grow faster |
| 90–100 | 5 | Grow fastest |

`easeFactor = max(1.3, ef + 0.1 - (5-q) × (0.08 + (5-q) × 0.02))`

### Done when
- [ ] 3+ notes with 50+ words → quiz with 5 questions, 4 options each
- [ ] Score 100 → `nextReviewAt` far in future
- [ ] Score 0 → `nextReviewAt` = tomorrow, interval reset
- [ ] Review queue shows overdue topics after low score

---

## Phase 5 — F04: AI Quiz Generator

**Goal:** Claude-powered quiz with rate limiting and automatic fallback to rule-based.

### Files
- [ ] `src/lib/rate-limiter.ts` — `checkRateLimit(clientId)`, `incrementRateLimit(clientId)` (10/hour)
- [ ] `src/lib/ai/claude-client.ts` — Anthropic SDK singleton
- [ ] `src/lib/ai/quiz-prompt.ts` — `buildQuizPrompt(notes, difficulty, count): string`
- [ ] `src/lib/ai/generate-ai-quiz.ts` — `Promise.race` with 8000ms timeout
- [ ] `src/lib/ai/validate-ai-response.ts` — validate Claude JSON → `Question[]`
- [ ] Update `src/app/api/quiz/generate/route.ts` — add `?mode=ai` branch

### AI Generation Flow
```
GET /api/quiz/generate?mode=ai&topicId=X&difficulty=medium

1. Check rate limit → 429 if exceeded
2. try generateAIQuiz()
   ├─ success → quiz.generatedBy = 'claude-api'
   └─ any error (timeout / malformed JSON) →
        generateRuleBasedQuiz() → quiz.generatedBy = 'rule-based'
3. Return Quiz (client always gets a valid response)
```

### Done when
- [ ] `?mode=ai` → `quiz.generatedBy === 'claude-api'`
- [ ] Invalid API key → fallback, `generatedBy === 'rule-based'`, toast shown to user
- [ ] 11th request in 1 hour → HTTP 429
- [ ] `ANTHROPIC_API_KEY` absent from git history

---

## Phase 6 — Test Suite (Vitest)

**Goal:** Coverage of F01–F04 happy paths + key edge cases.

### Pure Function Tests
- [ ] `src/__tests__/lib/word-count.test.ts` — empty, whitespace-only, multi-space
- [ ] `src/__tests__/lib/quiz-generator.test.ts` — happy path, `InsufficientContentError`, empty notes
- [ ] `src/__tests__/lib/sm2.test.ts` — score 100 grows interval, score 0 resets, `easeFactor` ≥ 1.3
- [ ] `src/__tests__/lib/score.test.ts` — all correct = 100, all wrong = 0, half = 50
- [ ] `src/__tests__/lib/rate-limiter.test.ts` — 10th allowed, 11th blocked, 1hr reset
- [ ] `src/__tests__/lib/study-time.test.ts` — sum, weekly filter

### API Route Tests
- [ ] `src/__tests__/api/topics.test.ts` — CRUD happy paths, 404 on missing id
- [ ] `src/__tests__/api/quiz-generate.test.ts` — rule-based; AI success; AI throws → fallback; rate limit → 429; bad topicId → 400
- [ ] `src/__tests__/api/quiz-submit.test.ts` — valid submission; 404 bad quiz id; 400 wrong answer count
- [ ] `src/__tests__/api/review-queue.test.ts` — only due topics, sorted by most overdue

### Component Tests
- [ ] `src/__tests__/components/StudyTimer.test.tsx` — Start/Stop; localStorage; resume on remount
- [ ] `src/__tests__/components/NoteEditor.test.tsx` — auto-save debounce; word count
- [ ] `src/__tests__/components/QuizGenerator.test.tsx` — fallback toast; score display

### Done when
- [ ] `npm run test` → all tests pass
- [ ] Happy paths for F01–F04 covered
- [ ] Edge cases covered: `InsufficientContentError`, SM-2 reset, rate limit block, AI fallback

---

## Critical Files

| File | Why |
|------|-----|
| `src/types/index.ts` | Every module imports from here — must be defined first |
| `src/lib/store.ts` | All API routes read/write through the store |
| `src/lib/quiz-generator.ts` | Core F03 logic; edge cases must be handled correctly |
| `src/lib/sm2.ts` | Core spaced repetition; bugs here break the review queue |
| `src/app/api/quiz/generate/route.ts` | Most complex route: owns AI + fallback + rate-limit logic |
