'use client'

import { useState } from 'react'
import { Pencil, Trash2, BookOpen, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TopicForm from './TopicForm'
import { useUpdateTopic, useDeleteTopic } from '@/hooks/useTopics'
import type { Topic } from '@/types'

interface TopicCardProps {
  topic: Topic
}

export default function TopicCard({ topic }: TopicCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const update = useUpdateTopic()
  const del = useDeleteTopic()

  function handleEdit(input: { title: string; description: string }) {
    update.mutate(
      { id: topic.id, input },
      { onSuccess: () => setEditOpen(false) }
    )
  }

  function handleDelete() {
    if (!confirm(`Delete "${topic.title}"?`)) return
    del.mutate(topic.id)
  }

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-1">{topic.title}</CardTitle>
          {topic.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
          )}
        </CardHeader>
        <CardContent className="flex gap-3 pb-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {topic.noteCount} notes
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="size-3" />
            {topic.totalStudyMinutes} min
          </Badge>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 mt-auto pt-2">
          <Button size="icon" variant="ghost" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={handleDelete} disabled={del.isPending}>
            <Trash2 className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit topic</DialogTitle>
          </DialogHeader>
          <TopicForm
            initial={topic}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
            isPending={update.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
