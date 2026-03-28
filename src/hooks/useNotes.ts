'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { notesApi } from '@/lib/api-client'

const notesKey = (topicId: string) => ['notes', topicId] as const

export function useNotes(topicId: string) {
  return useQuery({
    queryKey: notesKey(topicId),
    queryFn: () => notesApi.list(topicId),
  })
}

export function useCreateNote(topicId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => notesApi.create(topicId, { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notesKey(topicId) })
      qc.invalidateQueries({ queryKey: ['topics'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteNote(topicId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notesKey(topicId) })
      qc.invalidateQueries({ queryKey: ['topics'] })
      toast.success('Note deleted')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved'

export function useAutoSaveNote(noteId: string, topicId: string, initialContent: string) {
  const qc = useQueryClient()
  const [content, setContent] = useState(initialContent)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(
    async (text: string) => {
      setStatus('saving')
      try {
        await notesApi.update(noteId, text)
        qc.invalidateQueries({ queryKey: notesKey(topicId) })
        setStatus('saved')
      } catch {
        toast.error('Failed to save note')
        setStatus('idle')
      }
    },
    [noteId, topicId, qc]
  )

  const handleChange = useCallback(
    (text: string) => {
      setContent(text)
      setStatus('pending')
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => save(text), 30_000)
    },
    [save]
  )

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { content, handleChange, status }
}
