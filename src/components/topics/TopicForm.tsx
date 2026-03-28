'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Topic, CreateTopicInput } from '@/types'

interface TopicFormProps {
  initial?: Pick<Topic, 'title' | 'description'>
  onSubmit: (input: CreateTopicInput) => void
  onCancel: () => void
  isPending?: boolean
}

export default function TopicForm({ initial, onSubmit, onCancel, isPending }: TopicFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, description })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        placeholder="Topic title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
