'use client'

import { useState } from 'react'
import { useNotes, useCreateNote, useDeleteNote } from '@/hooks/useNotes'
import NoteEditor from './NoteEditor'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface NoteListProps {
  topicId: string
}

export default function NoteList({ topicId }: NoteListProps) {
  const { data: notes, isLoading } = useNotes(topicId)
  const createNote = useCreateNote(topicId)
  const deleteNote = useDeleteNote(topicId)
  const [adding, setAdding] = useState(false)

  if (isLoading) return <p className="text-muted-foreground">Loading notes…</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Button
          size="sm"
          onClick={async () => {
            setAdding(true)
            await createNote.mutateAsync('')
            setAdding(false)
          }}
          disabled={adding}
        >
          + New Note
        </Button>
      </div>

      {notes?.length === 0 && (
        <p className="text-muted-foreground text-sm">No notes yet. Add one to get started.</p>
      )}

      <div className="space-y-4">
        {notes?.map((note, i) => (
          <div key={note.id}>
            {i > 0 && <Separator className="mb-4" />}
            <NoteEditor
              note={note}
              topicId={topicId}
              onDelete={(id) => deleteNote.mutate(id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
