'use client'

import type { Question } from '@/types'

interface Props {
  question: Question
  index: number
  selected: number | null
  onSelect: (optionIndex: number) => void
}

export default function QuizQuestion({ question, index, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <p className="font-medium">
        {index + 1}. {question.text}
      </p>
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full text-left px-4 py-2 rounded-md border text-sm transition-colors ${
              selected === i
                ? 'border-primary bg-primary/10 font-medium'
                : 'border-border hover:bg-muted'
            }`}
          >
            {String.fromCharCode(65 + i)}. {option}
          </button>
        ))}
      </div>
    </div>
  )
}
