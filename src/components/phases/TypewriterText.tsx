import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text:       string
  speed?:     number      // ms per character
  delay?:     number      // ms before starting
  onComplete?: () => void
  className?: string
  style?:     React.CSSProperties
}

export function TypewriterText({
  text, speed = 28, delay = 0, onComplete, className, style,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted]     = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      onComplete?.()
      return
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(t)
  }, [started, displayed, text, speed, onComplete])

  return (
    <span className={className} style={style}>
      {displayed}
      {displayed.length < text.length && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
          style={{ background: 'var(--accent-secondary)' }}
        />
      )}
    </span>
  )
}
