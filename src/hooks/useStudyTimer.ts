'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { studySessionsApi } from '@/lib/api-client'

interface TimerState {
  topicId: string
  startedAt: string
  isRunning: boolean
}

const STORAGE_KEY = 'pla_study_timer'

function loadTimer(): TimerState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TimerState) : null
  } catch {
    return null
  }
}

function saveTimer(state: TimerState | null) {
  if (state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function useStudyTimer(topicId: string) {
  const qc = useQueryClient()
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds
  const startedAtRef = useRef<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadTimer()
    if (saved && saved.topicId === topicId && saved.isRunning) {
      const startedAt = new Date(saved.startedAt)
      const seconds = Math.floor((Date.now() - startedAt.getTime()) / 1000)
      startedAtRef.current = saved.startedAt
      setElapsed(seconds)
      setIsRunning(true)
    }
  }, [topicId])

  // Tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const startedAt = startedAtRef.current
        if (startedAt) {
          setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
        }
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const start = useCallback(() => {
    const now = new Date().toISOString()
    startedAtRef.current = now
    setElapsed(0)
    setIsRunning(true)
    saveTimer({ topicId, startedAt: now, isRunning: true })
  }, [topicId])

  const stop = useCallback(async () => {
    if (!startedAtRef.current) return
    const startedAt = startedAtRef.current
    const endedAt = new Date().toISOString()
    const durationMinutes = Math.max(1, Math.round(elapsed / 60))

    setIsRunning(false)
    setElapsed(0)
    startedAtRef.current = null
    saveTimer(null)

    try {
      await studySessionsApi.create({ topicId, durationMinutes, startedAt, endedAt })
      qc.invalidateQueries({ queryKey: ['topics'] })
      toast.success(`Study session saved (${durationMinutes} min)`)
    } catch {
      toast.error('Failed to save study session')
    }
  }, [elapsed, topicId, qc])

  return { isRunning, elapsed, start, stop }
}
