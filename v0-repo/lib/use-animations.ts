'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Animate a number from 0 to `target` over `duration` ms using easeOutCubic.
 * Returns the current intermediate value as a plain number so the caller can
 * format it however it wants.
 */
export function useAnimatedNumber(target: number, duration = 1400, startDelay = 0) {
  const [value, setValue] = useState(0)
  const startedAt = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const startTimer = setTimeout(() => {
      if (cancelled) return
      const tick = (ts: number) => {
        if (startedAt.current === null) startedAt.current = ts
        const elapsed = ts - startedAt.current
        const t = Math.min(1, elapsed / duration)
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(target * eased)
        if (t < 1 && !cancelled) {
          rafId.current = requestAnimationFrame(tick)
        } else {
          setValue(target)
        }
      }
      rafId.current = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      startedAt.current = null
    }
  }, [target, duration, startDelay])

  return value
}

/**
 * Cycle through an array of values on an interval. Returns the current item
 * and its index. Pauses on tab blur to save CPU.
 */
export function useRotating<T>(items: readonly T[], intervalMs = 2400) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    let id: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (id !== null) return
      id = setInterval(() => {
        setIndex(i => (i + 1) % items.length)
      }, intervalMs)
    }
    const stop = () => {
      if (id !== null) {
        clearInterval(id)
        id = null
      }
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [items.length, intervalMs])

  return { item: items[index], index }
}
