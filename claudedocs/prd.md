# Product Requirements Document (PRD)
## Personal Learning Assistant (PLA)

> **เวอร์ชัน:** 1.0
> **อัปเดตล่าสุด:** มีนาคม 2569
> **สถานะ:** Approved — พร้อมใช้เป็น Reference ตลอดคอร์ส

---

## 1. Overview & Problem Statement

นักศึกษามหาวิทยาลัยไทยส่วนใหญ่มีปัญหาเรื่อง **การลืมเนื้อหาที่เรียน** หลังจากผ่านไปไม่กี่วัน ปัญหานี้ไม่ได้เกิดจากความไม่ตั้งใจ แต่เกิดจากการขาดระบบทบทวนที่เป็นระบบและเหมาะสม งานวิจัยด้านการเรียนรู้พบว่า การทบทวนแบบ Spaced Repetition ช่วยให้จำข้อมูลได้ดีกว่าการอ่านซ้ำแบบปกติถึง 3–4 เท่า แต่เครื่องมือที่มีอยู่ในตลาดอย่าง Anki หรือ Notion ไม่ได้ออกแบบมาให้ใช้งานง่ายสำหรับบริบทของนักศึกษาไทย

**Personal Learning Assistant (PLA)** คือเว็บแอปที่ถูกออกแบบมาเพื่อช่วยให้นักศึกษาสามารถ จด บันทึก ทบทวน และทดสอบความเข้าใจของตัวเองได้ในที่เดียว โดยมี AI เป็นตัวช่วยสร้าง Quiz อัตโนมัติจากโน้ตที่นักศึกษาบันทึกไว้ ทำให้การทบทวนไม่น่าเบื่อและมีประสิทธิภาพมากขึ้น

ในระยะแรก (Phase 1) PLA จะเป็น Prototype ที่ใช้ mock data โดยไม่มีระบบ database จริง เพื่อให้ทีมพัฒนาสามารถ validate UX และ core logic ได้รวดเร็ว ก่อนที่จะ scale ไปสู่ระบบ Production (Phase 2) ที่มี PostgreSQL และ deploy บน Vercel

---

## 2. Project Information

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **Product Name** | Personal Learning Assistant (PLA) |
| **Platform** | Web App (ไม่ใช่ Mobile) |
| **กลุ่มเป้าหมาย** | นักศึกษามหาวิทยาลัยไทย อายุ 18–24 ปี |
| **ปัญหาที่แก้** | นักศึกษาลืมเนื้อหา เพราะขาดระบบทบทวนที่เป็นระบบ |
| **Competitors** | Anki (flashcard), Notion (note-taking) |
| **Team** | 2 Frontend Developer + 1 Fullstack Developer |
| **Timeline** | 2 เดือน |

### Tech Stack

| Layer | Technology | หมายเหตุ |
|-------|-----------|---------|
| Framework | Next.js 14 + TypeScript | App Router |
| UI Components | Shadcn UI | บน Tailwind CSS |
| Data Fetching | TanStack Query | Client-side caching |
| AI Integration | Vercel AI SDK | สำหรับ AI Quiz Generator |
| Database | PostgreSQL | Phase 2 เท่านั้น |
| Deployment | Vercel | Phase 2 เท่านั้น |
| Testing | Vitest | ไม่ใช่ Jest |

---

## 3. Goals & Success Metrics

### Business Goals

- ลดเวลาที่นักศึกษาใช้ในการทบทวนเนื้อหาลง 30% โดยไม่ลดประสิทธิภาพการจำ
- สร้างนิสัยการทบทวนสม่ำเสมอ (Daily Habit) ให้กับผู้ใช้

### Success Metrics (KPIs)

| # | Metric | เป้าหมาย | วัดที่ |
|---|--------|----------|-------|
| KPI-1 | อัตราผู้ใช้ที่ทำ Quiz อย่างน้อย 3 ครั้ง/สัปดาห์ | ≥ 70% ของ active users | ภายใน 30 วันหลัง launch |
| KPI-2 | อัตรา Retention ของผู้ใช้ | ≥ 60% กลับมาใช้งานใน 7 วัน | หลัง first use |
| KPI-3 | เวลาสร้าง Quiz (AI mode) | < 5 วินาที | per generate |
| KPI-4 | เวลาโหลด Topic list | < 300ms | Phase 1, mock data |
| KPI-5 | Quiz Attempt ที่ระบบรองรับได้ | ≥ 500 attempts/user | ไม่มี performance degradation |

---

## 4. User Stories

### F01 — Topic Manager

- **US-01:** As a student, I want to create a new topic with a name and description so that I can organize the content I want to learn in a systematic way.
- **US-02:** As a student, I want to view all my topics so that I know what I am currently studying.
- **US-03:** As a student, I want to edit and delete topics so that I can keep my content up to date at all times.

### F02 — Note Editor + Study Timer

- **US-04:** As a student, I want to add, edit, and delete notes within a topic so that I have a place to record important content for future reference.
- **US-05:** As a student, I want to start and stop a study timer so that I know how much time I have spent studying each topic.
- **US-06:** As a student, I want to view the total study time for each topic so that I can plan my study schedule more effectively.

### F03 — Smart Quiz & Review System

- **US-07:** As a student, I want to generate a quiz from my saved notes so that I can test my own understanding without having to create questions manually.
- **US-08:** As a student, I want to answer multiple-choice quiz questions and receive a score immediately so that I know right away how well I understand the content.
- **US-09:** As a student, I want to view my quiz history and score trends so that I can track my progress in each topic over time.
- **US-10:** As a student, I want to receive recommendations on which topics to review so that I do not forget content I have already studied.

### F04 — AI Quiz Generator

- **US-11:** As a student, I want AI to generate quiz questions based on the actual context of my notes so that the questions are higher quality than simple keyword extraction.
- **US-12:** As a student, I want to select a difficulty level (easy / medium / hard) so that I can adjust the quiz difficulty to match my current level.

---

## 5. Functional Requirements

### F01 — Topic Manager

1. รองรับ CRUD operations ครบถ้วน (Create, Read, Update, Delete)
2. แสดงจำนวน notes และ total study time ใน topic list
3. Sort topics ตาม last studied date (ล่าสุดขึ้นก่อน)
4. ใช้ mock data (in-memory) ใน Phase 1

### F02 — Note Editor + Study Timer

1. รองรับ plain text editor สำหรับบันทึกเนื้อหา
2. Auto-save note content ทุก 30 วินาที
3. Study timer ที่ start/stop ได้ และบันทึก duration เป็น session log
4. Timer ต้อง persist แม้จะ refresh หน้า (ใช้ localStorage ใน Phase 1)
5. แสดง total study time per topic และ weekly summary

### F03 — Smart Quiz & Review System

1. Generate quiz จาก note content แบบ rule-based extraction (Phase 1)
2. Quiz format: multiple choice (1 คำถาม + 4 ตัวเลือก)
3. คำนวณ score ทันทีหลังส่งคำตอบ (0–100)
4. บันทึก QuizAttempt ทุกครั้งที่ทำ quiz
5. Spaced Repetition: คำนวณ `nextReviewAt` จาก score โดยใช้ SM-2 algorithm
6. Review queue แสดง topics ที่ถึงเวลาทบทวน

### F04 — AI Quiz Generator (Vercel AI SDK + Claude API)

1. API Route `GET /api/quiz/generate?mode=ai` เรียก Claude ผ่าน Vercel AI SDK
2. ส่ง note content เป็น prompt context ให้ Claude สร้างคำถาม
3. Parse JSON response จาก Claude เป็น `Question[]`
4. Error handling กรณี API timeout หรือ malformed response
5. Fallback ไป rule-based (F03) โดยอัตโนมัติเมื่อ API ล้มเหลว
6. Rate limit: ไม่เกิน 10 generates ต่อ user ต่อชั่วโมง

---

## 6. Non-Functional Requirements

### Performance

| Requirement | เป้าหมาย |
|-------------|---------|
| Topic list load time | < 300ms (Phase 1, mock data) |
| Quiz generation (rule-based) | < 500ms |
| Quiz generation (AI mode) | < 5 วินาที (รวม API call) |
| Quiz attempt history | รองรับได้ถึง 500 attempts/user |

### Security

- `ANTHROPIC_API_KEY` ต้องไม่ commit ลง repository ทุกกรณี
- API routes ทุก `/api/cron/*` ต้องตรวจสอบ `Authorization: Bearer ${CRON_SECRET}` ก่อนประมวลผล
- ไม่เก็บข้อมูล sensitive ของนักศึกษาใน Phase 1 (ไม่มี authentication)

### Reliability

- ระบบต้องมี fallback จาก AI Quiz → Rule-based Quiz เสมอ เมื่อ Claude API ไม่พร้อมใช้งาน

### Developer Experience

- TypeScript strict mode ทุกไฟล์
- Test coverage ครอบคลุม happy path + edge cases ของ F01–F04 ด้วย Vitest

---

## 7. Feature Roadmap ตาม Phase

### Phase 1 — Prototype (Module 01–05)

| Feature | สถานะ | หมายเหตุ |
|---------|-------|---------|
| F01 Topic Manager | ✅ สร้างใน Module 03 | Mock data |
| F02 Note Editor + Study Timer | ✅ สร้างใน Module 03 | Mock data + localStorage |
| F03 Smart Quiz (Rule-based) | ✅ สร้างใน Module 03 | Mock data |
| F04 AI Quiz Generator | ✅ สร้างใน Module 04 | ต้องการ API Key จริง |
| Review Queue UI | ✅ สร้างใน Module 04 | — |
| Test Suite (Vitest) | ✅ สร้างใน Module 05 | — |

### Phase 2 — Production (Module 06)

| Feature | สถานะ | หมายเหตุ |
|---------|-------|---------|
| PostgreSQL Integration | 🔜 Module 06 | แทน mock data |
| Vercel Deployment | 🔜 Module 06 | CI/CD via GitHub Actions |
| Vercel Cron Jobs | 🔜 Module 06 | Review queue + Rate limit reset |
| Environment Variables | 🔜 Module 06 | จัดการผ่าน Vercel Dashboard |

---

## 8. API Routes

| Method | Path | Description | Phase |
|--------|------|-------------|-------|
| `GET` | `/api/topics` | ดึง topic list ทั้งหมด | 1 |
| `POST` | `/api/topics` | สร้าง topic ใหม่ | 1 |
| `PUT` | `/api/topics/[id]` | อัปเดต topic | 1 |
| `DELETE` | `/api/topics/[id]` | ลบ topic | 1 |
| `GET` | `/api/topics/[id]/notes` | ดึง notes ใน topic | 1 |
| `POST` | `/api/topics/[id]/notes` | เพิ่ม note | 1 |
| `PUT` | `/api/notes/[id]` | แก้ไข note | 1 |
| `DELETE` | `/api/notes/[id]` | ลบ note | 1 |
| `POST` | `/api/study-sessions` | บันทึก study session | 1 |
| `GET` | `/api/quiz/generate` | สร้าง quiz (rule-based) | 1 |
| `GET` | `/api/quiz/generate?mode=ai` | สร้าง quiz ด้วย Claude API | 1/2 |
| `POST` | `/api/quiz/[id]/submit` | ส่งคำตอบ + คำนวณ score | 1 |
| `GET` | `/api/quiz/attempts` | ดู quiz history | 1 |
| `GET` | `/api/review/queue` | ดู topics ที่ถึงเวลาทบทวน | 1 |
| `GET` | `/api/cron/update-review-queue` | (Cron) อัปเดต ReviewSchedule ทุกเที่ยงคืน | 2 |
| `GET` | `/api/cron/reset-ai-rate-limit` | (Cron) Reset rate limit ทุกชั่วโมง | 2 |

---

## 9. Out of Scope

สิ่งต่อไปนี้ **ไม่อยู่ใน scope** ของ PLA v1.0 และจะพิจารณาในเวอร์ชันถัดไป:

- Topic sharing ระหว่าง users
- Collaborative note-taking
- File attachments ใน notes
- Open-ended quiz questions (ตอบอิสระ)
- Group หรือ multiplayer quiz
- Rich text editor / Markdown preview (Phase 1 ใช้ plain text เท่านั้น)
- User Authentication / Login (Phase 1 ใช้ anonymous session)
- Custom AI model นอกจาก Claude
- Fine-tuning model
- Mobile app

---

## 10. Open Questions

| # | คำถาม | คำแนะนำ | สถานะ |
|---|-------|---------|-------|
| OQ-1 | PostgreSQL ใน Capstone: ผู้เรียนต้องต่อ DB จริงหรือแค่ mock data พอ? | Mock data พอ เพื่อลดความซับซ้อน capstone | 🔄 รอตัดสินใจ |
| OQ-2 | Note Editor: plain text หรือ rich text (Markdown)? | Plain text ใน Phase 1 เพื่อลด dependency | ✅ ตัดสินใจแล้ว |
| OQ-3 | SM-2 Algorithm: implement ใน Module ไหน? | Module 03 เพราะเป็นส่วนหนึ่งของ Smart Quiz | ✅ ตัดสินใจแล้ว |
| OQ-4 | Demo Repository: ควรมี starter repo ต่อ module ไหม? | มี snapshot code state ตอนต้นของแต่ละ module | 🔄 รอตัดสินใจ |

---

## 11. TypeScript Interfaces หลัก

```typescript
// Topics & Notes
interface Topic {
  id: string
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
  totalStudyMinutes: number
  noteCount: number
}

interface Note {
  id: string
  topicId: string
  content: string           // plain text (Phase 1)
  wordCount: number
  createdAt: Date
  updatedAt: Date
}

interface StudySession {
  id: string
  topicId: string
  startedAt: Date
  endedAt?: Date
  durationMinutes: number
}

// Quiz System
interface Quiz {
  id: string
  topicId: string
  noteIds: string[]
  questions: Question[]
  generatedAt: Date
  generatedBy: 'rule-based' | 'claude-api'
}

interface Question {
  id: string
  quizId: string
  questionText: string
  options: string[]         // 4 ตัวเลือก
  correctAnswer: number     // index 0–3
  sourceNoteId: string
}

interface QuizAttempt {
  id: string
  quizId: string
  userId?: string           // Phase 2 เท่านั้น
  answers: number[]
  score: number             // 0–100
  completedAt: Date
  durationSeconds: number
}

// Spaced Repetition
interface ReviewSchedule {
  topicId: string
  lastReviewedAt?: Date
  nextReviewAt: Date
  repetitionInterval: number    // days
  easeFactor: number            // SM-2 parameter
  consecutiveCorrect: number
}
```

---

*PRD ฉบับนี้สร้างโดยใช้ CARE Prompt Framework และ Claude AI — ใช้เป็น reference ตลอดทั้งคอร์ส AI for Software Engineering*
