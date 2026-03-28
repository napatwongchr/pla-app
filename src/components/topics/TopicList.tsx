'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TopicCard from './TopicCard'
import TopicForm from './TopicForm'
import { useTopics, useCreateTopic } from '@/hooks/useTopics'

export default function TopicList() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: topics, isLoading, isError } = useTopics()
  const create = useCreateTopic()

  function handleCreate(input: { title: string; description: string }) {
    create.mutate(input, { onSuccess: () => setCreateOpen(false) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Topics</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4 mr-1" />
          New topic
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}
      {isError && <p className="text-destructive">Failed to load topics.</p>}

      {topics && topics.length === 0 && (
        <p className="text-muted-foreground">No topics yet. Create your first one!</p>
      )}

      {topics && topics.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <TopicCard key={t.id} topic={t} />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New topic</DialogTitle>
          </DialogHeader>
          <TopicForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isPending={create.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
