"use client"

import { useViewCount, useViewCountRead } from '@/hooks/useViewCount'
import commaNumber from 'comma-number'

interface ViewCounterProps {
  postId: string
  /**
   * If true, increments the view count on mount
   * If false, only displays the current count
   */
  trackView?: boolean
  className?: string
  showLabel?: boolean
}

/**
 * Client-side view counter component
 * Automatically tracks views or just displays count
 */
export function ViewCounter({ 
  postId, 
  trackView = false, 
  className = '',
  showLabel = true 
}: ViewCounterProps) {
  // Call both hooks unconditionally to satisfy Rules of Hooks
  const writeResult = useViewCount(postId, !trackView) // Pass skip flag
  const readResult = useViewCountRead(postId, trackView) // Pass skip flag
  
  // Use the appropriate result based on trackView
  const { views, isLoading, error } = trackView ? writeResult : readResult

  if (error) {
    return null
  }

  if (isLoading) {
    return (
      <span className={className}>
        {showLabel && 'Views: '}
        <span className="animate-pulse">...</span>
      </span>
    )
  }

  return (
    <span className={className}>
      {showLabel && 'Views: '}
      <span className="font-semibold">{commaNumber(views)}</span>
    </span>
  )
}
