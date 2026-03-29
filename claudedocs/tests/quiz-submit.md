# Test Cases: POST /api/quiz/[id]/submit

> Source: `src/app/api/quiz/[id]/submit/route.ts`, `src/lib/score.ts`, `src/lib/sm2.ts`
> Date: 2026-03-29

---

## 1. Positive Scenarios

### TC-P-01: Submit ถูกทุกข้อ
| Field | Detail |
|---|---|
| **Precondition** | Quiz `quiz-1` มี 3 questions, correctIndex = [1, 0, 2]; ไม่มี ReviewSchedule |
| **Input** | `POST /api/quiz/quiz-1/submit` body: `{ "answers": [1, 0, 2] }` |
| **Expected** | HTTP 201, body: `{ id, quizId: "quiz-1", topicId, answers: [1,0,2], score: 100, completedAt: <ISO string> }` |
| **Why** | `calculateScore`: 3/3 = 100 |

### TC-P-02: Submit ถูกบางข้อ
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 4 questions, correctIndex = [0, 1, 2, 3] |
| **Input** | `answers: [0, 1, 9, 9]` (ถูก 2 ข้อ) |
| **Expected** | HTTP 201, `score: 50` |
| **Why** | `Math.round(2/4 * 100) = 50` |

### TC-P-03: Submit ผิดทุกข้อ
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 3 questions, correctIndex = [0, 0, 0] |
| **Input** | `answers: [1, 2, 3]` |
| **Expected** | HTTP 201, `score: 0` |
| **Why** | 0/3 = 0 |

### TC-P-04: ผลลัพธ์บันทึก attempt ครบถ้วน
| Field | Detail |
|---|---|
| **Precondition** | Quiz `quiz-abc` มี 2 questions, topicId = `topic-xyz` |
| **Input** | `answers: [0, 1]` |
| **Expected** | Response body มีครบทุก field: `id` (non-empty string), `quizId: "quiz-abc"`, `topicId: "topic-xyz"`, `answers: [0,1]`, `score` (number), `completedAt` (string); ไม่มี field แปลกปลอม |
| **Why** | ครอบคลุม requirement "บันทึก score และ timestamp" |

### TC-P-04b: `quizId` ใน response ตรงกับ id ใน URL param
| Field | Detail |
|---|---|
| **Precondition** | Quiz `quiz-xyz` มีอยู่ใน store |
| **Input** | `POST /api/quiz/quiz-xyz/submit` body: answers ที่ valid |
| **Expected** | `response.quizId === "quiz-xyz"` — ตรงกับ URL param เสมอ ไม่ใช่ค่า hardcode จาก body |
| **Why** | ป้องกัน implementation bug ที่อาจเอา quizId จาก body แทน URL |

### TC-P-04c: `score` อยู่ในช่วง 0–100 เสมอ
| Field | Detail |
|---|---|
| **Precondition** | Quiz ที่มี questions หลายรูปแบบ (ถูกทุกข้อ, ผิดทุกข้อ, ถูกบางข้อ, out-of-range answers) |
| **Input** | answers ชุดต่างๆ |
| **Expected** | `score >= 0` และ `score <= 100` ทุกกรณี; เป็น integer (Math.round) |
| **Why** | ป้องกัน edge case เช่น NaN, Infinity, หรือค่าเกิน range ที่อาจเกิดจาก calculateScore |

### TC-P-05: Attempt ถูกบันทึกใน store
| Field | Detail |
|---|---|
| **Precondition** | Quiz มีอยู่ |
| **Input** | ส่ง answers ที่ valid |
| **Expected** | `store.quizAttempts.get(response.id)` คืนค่า object เดียวกับ response body |
| **Why** | ตรวจสอบ persistence ใน in-memory store |

### TC-P-06: อัพเดต ReviewSchedule เมื่อมี schedule อยู่แล้ว
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี topicId = `topic-1`; `store.reviewSchedules` มี entry สำหรับ `topic-1` (easeFactor=2.5, intervalDays=6, repetitions=1) |
| **Input** | `answers` ที่ให้ score=100 |
| **Expected** | HTTP 201; `store.reviewSchedules.get("topic-1")` ถูก update: `intervalDays` เปลี่ยนจาก 6, `repetitions` เพิ่มขึ้น |
| **Why** | SM-2 ต้องถูก invoke และ persist ผลลัพธ์ |

### TC-P-07: ไม่ crash เมื่อไม่มี ReviewSchedule
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี topicId ที่ **ไม่มี** entry ใน `reviewSchedules` |
| **Input** | answers ที่ valid |
| **Expected** | HTTP 201 สำเร็จ; ไม่มี exception; `reviewSchedules` ยังว่างสำหรับ topicId นั้น |
| **Why** | Code มี `if (existing)` guard — ต้องไม่ throw |

### TC-P-08: ส่งซ้ำหลายครั้ง (Multiple attempts)
| Field | Detail |
|---|---|
| **Precondition** | Quiz เดิม, ส่งครั้งแรกไปแล้ว |
| **Input** | ส่ง answers ชุดเดิมอีกครั้ง |
| **Expected** | HTTP 201 ทั้งสองครั้ง; แต่ละครั้งได้ `id` ใหม่ที่ต่างกัน; `store.quizAttempts` มีทั้งสอง attempt |
| **Why** | ระบบต้องรองรับการ attempt หลายครั้ง |

---

## 2. Negative Scenarios

### TC-N-01: Quiz ไม่มีในระบบ
| Field | Detail |
|---|---|
| **Precondition** | ไม่มี quiz ที่ id = `nonexistent-id` |
| **Input** | `POST /api/quiz/nonexistent-id/submit` body: `{ "answers": [0] }` |
| **Expected** | HTTP 404, body: `{ "error": "Quiz not found" }` |

### TC-N-02: Body ไม่ใช่ JSON ที่ valid
| Field | Detail |
|---|---|
| **Precondition** | Quiz `quiz-1` มีอยู่ |
| **Input** | body: `"this is not json{{{"` (malformed JSON), Content-Type: application/json |
| **Expected** | HTTP 400, body: `{ "error": "Invalid JSON" }` |

### TC-N-03: `answers` ไม่ใช่ array — เป็น string
| Field | Detail |
|---|---|
| **Precondition** | Quiz มีอยู่ |
| **Input** | `{ "answers": "0,1,2" }` |
| **Expected** | HTTP 400, body: `{ "error": "answers must be an array" }` |

### TC-N-04: `answers` ไม่ใช่ array — เป็น number
| Field | Detail |
|---|---|
| **Precondition** | Quiz มีอยู่ |
| **Input** | `{ "answers": 123 }` |
| **Expected** | HTTP 400, `{ "error": "answers must be an array" }` |

### TC-N-05: `answers` ไม่ใช่ array — เป็น null
| Field | Detail |
|---|---|
| **Precondition** | Quiz มีอยู่ |
| **Input** | `{ "answers": null }` |
| **Expected** | HTTP 400, `{ "error": "answers must be an array" }` |

### TC-N-06: `answers` field ไม่มีใน body
| Field | Detail |
|---|---|
| **Precondition** | Quiz มีอยู่ |
| **Input** | `{}` |
| **Expected** | HTTP 400, `{ "error": "answers must be an array" }` |
| **Why** | `undefined` ไม่ผ่าน `Array.isArray()` |

### TC-N-07: จำนวน answers น้อยกว่า questions
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 3 questions |
| **Input** | `{ "answers": [0, 1] }` (2 items) |
| **Expected** | HTTP 400, body: `{ "error": "Expected 3 answers, got 2" }` |

### TC-N-08: จำนวน answers มากกว่า questions
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 3 questions |
| **Input** | `{ "answers": [0, 1, 2, 3] }` (4 items) |
| **Expected** | HTTP 400, body: `{ "error": "Expected 3 answers, got 4" }` |

### TC-N-09: ไม่บันทึก attempt เมื่อ validation ล้มเหลว
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 2 questions; บันทึก `store.quizAttempts.size` ก่อนส่ง |
| **Input** | `{ "answers": [0] }` (ผิด length) |
| **Expected** | HTTP 400; `store.quizAttempts.size` ไม่เพิ่มขึ้น |

---

## 3. Edge Cases

### TC-E-01: Quiz มี 0 questions (Empty quiz)
| Field | Detail |
|---|---|
| **Precondition** | Quiz ถูกสร้างด้วย `questions: []` |
| **Input** | `{ "answers": [] }` |
| **Expected** | HTTP 201, `score: 0` |
| **Why** | `calculateScore`: `questions.length === 0` return 0; length validation ผ่าน (0 === 0) |

### TC-E-02: Single question — ถูก
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 1 question, correctIndex = 2 |
| **Input** | `{ "answers": [2] }` |
| **Expected** | HTTP 201, `score: 100` |

### TC-E-03: Single question — ผิด
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 1 question, correctIndex = 2 |
| **Input** | `{ "answers": [0] }` |
| **Expected** | HTTP 201, `score: 0` |

### TC-E-04: Score boundary — SM-2 reset/progress threshold
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 10 questions, ReviewSchedule มีอยู่ |

| Score | Grade | SM-2 Action | Expected Result |
|---|---|---|---|
| 60 | 2 | reset | repetitions=0, intervalDays=1 |
| 70 | 3 | progress | repetitions++ |

**Why**: threshold ระหว่าง reset/progress อยู่ที่ grade 2/3 (score 60/70)

### TC-E-05: SM-2 interval progression (3 stages)
| Field | Detail |
|---|---|
| **Precondition** | ReviewSchedule: `{ repetitions: 0, intervalDays: 1, easeFactor: 2.5 }` |
| **Input** | score=100 (grade=5) |
| **Expected** | `intervalDays: 1`, `repetitions: 1` |

| Field | Detail |
|---|---|
| **Precondition** | ReviewSchedule: `{ repetitions: 1, intervalDays: 1, easeFactor: 2.5 }` |
| **Input** | score=100 |
| **Expected** | `intervalDays: 6`, `repetitions: 2` |

| Field | Detail |
|---|---|
| **Precondition** | ReviewSchedule: `{ repetitions: 2, intervalDays: 6, easeFactor: 2.5 }` |
| **Input** | score=100 |
| **Expected** | `intervalDays: Math.round(6 * 2.6) = 16`, `repetitions: 3` |

### TC-E-06: easeFactor ไม่ต่ำกว่า 1.3 (minimum clamp)
| Field | Detail |
|---|---|
| **Precondition** | ReviewSchedule: `{ easeFactor: 1.3, repetitions: 5, intervalDays: 20 }` |
| **Input** | score=0 (grade=0) — worst performance |
| **Expected** | `easeFactor >= 1.3`; `repetitions: 0`, `intervalDays: 1` (reset) |
| **Why** | `Math.max(1.3, ...)` ใน SM-2 algorithm |

### TC-E-07: Score ที่ grade boundary ทุกจุด
| Score | Expected Grade | SM-2 Action |
|---|---|---|
| 0 | 0 | reset |
| 39 | 1 | reset |
| 40 | 1 | reset |
| 59 | 1 | reset |
| 60 | 2 | reset |
| 69 | 2 | reset |
| 70 | 3 | progress |
| 79 | 3 | progress |
| 80 | 4 | progress |
| 89 | 4 | progress |
| 90 | 5 | progress |
| 100 | 5 | progress |

### TC-E-08: `completedAt` เป็น valid ISO timestamp
| Field | Detail |
|---|---|
| **Precondition** | Quiz มีอยู่ |
| **Input** | answers ที่ valid |
| **Expected** | `new Date(response.completedAt).toISOString()` ไม่ throw; timestamp อยู่ในช่วง ±5 วินาทีจากเวลาปัจจุบัน |

### TC-E-09: Response id เป็น UUID ที่ไม่ซ้ำกัน
| Field | Detail |
|---|---|
| **Input** | ส่ง 2 requests ติดกัน |
| **Expected** | `id` ของทั้งสอง response ต่างกัน และ match UUID format (`/^[0-9a-f-]{36}$/`) |

### TC-E-10: answers มี index ที่ out-of-range
| Field | Detail |
|---|---|
| **Precondition** | Quiz มี 1 question, correctIndex = 0, options มี 4 ตัว |
| **Input** | `{ "answers": [99] }` |
| **Expected** | HTTP 201; `score: 0` (99 !== 0) |
| **Note** | Implementation ไม่ validate ว่า answer value อยู่ใน valid option range — **known behavior** |

---

## Summary Matrix

| Category | Total | HTTP 201 | HTTP 400 | HTTP 404 |
|---|---|---|---|---|
| Positive | 10 | 10 | - | - |
| Negative | 9 | - | 8 | 1 |
| Edge | 10 | 8 | - | - |
| **Total** | **29** | **18** | **8** | **1** |

---

## QA Notes (จาก Code Review)

1. **TC-E-10 — Potential Bug**: ระบบไม่ validate ว่า `answers[i]` อยู่ใน valid range `[0, options.length-1]` นักศึกษาอาจส่ง index ที่ไม่มีจริงได้โดยไม่มี error
2. **SM-2 ไม่สร้าง ReviewSchedule ใหม่**: ถ้า topic ยังไม่มี schedule (`if (existing)` guard) ระบบจะ skip การ update ทั้งหมด ควรตรวจสอบว่าตรงกับ requirement หรือไม่
3. **In-memory store**: ข้อมูลหายเมื่อ server restart — แต่ละ test ต้องสร้าง fixture ใน store ก่อนเสมอ และ cleanup หลัง test (avoid test pollution)
