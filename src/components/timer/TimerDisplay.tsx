'use client'

interface TimerDisplayProps {
  elapsed: number // seconds
}

export default function TimerDisplay({ elapsed }: TimerDisplayProps) {
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="font-mono text-2xl tracking-widest">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}
