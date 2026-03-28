'use client'

import { useAutoSaveNote } from '@/hooks/useNotes'
import { countWords } from '@/lib/word-count'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Note } from '@/types'

interface NoteEditorProps {
  note: Note
  topicId: string
  onDelete: (id: string) => void
}

export default function NoteEditor({ note, topicId, onDelete }: NoteEditorProps) {
  const { content, handleChange, status } = useAutoSaveNote(note.id, topicId, note.content)
  const wordCount = countWords(content)

  const statusLabel =
    status === 'saving'
      ? 'Saving...'
      : status === 'saved'
        ? 'Saved ✓'
        : status === 'pending'
          ? 'Unsaved changes'
          : ''

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className="resize-none"
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{wordCount} words</span>
        <div className="flex items-center gap-3">
          <span>{statusLabel}</span>
          <Button variant="ghost" size="sm" onClick={() => onDelete(note.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
