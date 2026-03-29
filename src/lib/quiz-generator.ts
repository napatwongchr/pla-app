import { generateId } from '@/lib/id'
import type { Note, Quiz, Question } from '@/types'

export class InsufficientContentError extends Error {
  constructor() {
    super('Not enough content to generate a quiz. Add at least 3 notes with 50+ total words.')
    this.name = 'InsufficientContentError'
  }
}

function extractSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.split(/\s+/).length >= 5)
}

function extractKeyword(sentence: string): string {
  const words = sentence.split(/\s+/)
  const capitalized = words.find(w => /^[A-Z]/.test(w) && w.length > 3)
  if (capitalized) return capitalized.replace(/[^a-zA-Z]/g, '')
  return words.reduce((a, b) => (a.length >= b.length ? a : b)).replace(/[^a-zA-Z]/g, '')
}

export function generateRuleBasedQuiz(notes: Note[], quizId: string): Quiz {
  const totalWords = notes.reduce((sum, n) => sum + n.wordCount, 0)

  if (notes.length < 3 || totalWords < 50) {
    throw new InsufficientContentError()
  }

  const sentences = notes.flatMap(n => extractSentences(n.content))

  if (sentences.length < 4) {
    throw new InsufficientContentError()
  }

  const shuffled = [...sentences].sort(() => Math.random() - 0.5)
  const questionCount = Math.min(5, Math.floor(sentences.length / 4))
  const selected = shuffled.slice(0, Math.max(1, questionCount))

  const questions: Question[] = selected.map(correctSentence => {
    const keyword = extractKeyword(correctSentence)
    const distractors = sentences
      .filter(s => s !== correctSentence)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const allOptions = [correctSentence, ...distractors].sort(() => Math.random() - 0.5)
    const correctIndex = allOptions.indexOf(correctSentence)

    return {
      id: generateId(),
      text: `Which statement about "${keyword}" is correct?`,
      options: allOptions,
      correctIndex,
    }
  })

  return {
    id: quizId,
    topicId: notes[0].topicId,
    questions,
    generatedBy: 'rule-based',
    difficulty: 'medium',
    createdAt: new Date().toISOString(),
  }
}
