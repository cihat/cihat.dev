"use client"

import { useEffect, useState } from 'react'

interface UseViewCountReturn {
  views: number
  isLoading: boolean
  error: string | null
}

/**
 * Client-side hook for tracking and displaying view counts using API
 * Automatically increments view count on mount
 */
export function useViewCount(postId: string, skip = false): UseViewCountReturn {
  const [views, setViews] = useState(0)
  const [isLoading, setIsLoading] = useState(!skip)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (skip) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function trackView() {
      try {
        const response = await fetch(`/api/post-detail?id=${postId}&incr=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to track view')
        }

        const data = await response.json()

        if (isMounted) {
          setViews(data.views ?? 0)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to track view:', err)
        if (isMounted) {
          setError('Failed to load view count')
          setIsLoading(false)
        }
      }
    }

    trackView()

    return () => {
      isMounted = false
    }
  }, [postId, skip])

  return { views, isLoading, error }
}

/**
 * Hook to only fetch view count without incrementing
 */
export function useViewCountRead(postId: string, skip = false): UseViewCountReturn {
  const [views, setViews] = useState(0)
  const [isLoading, setIsLoading] = useState(!skip)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (skip) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function fetchViews() {
      try {
        const response = await fetch(`/api/post-detail?id=${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch views')
        }

        const data = await response.json()

        if (isMounted) {
          setViews(data.views ?? 0)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch views:', err)
        if (isMounted) {
          setError('Failed to load view count')
          setIsLoading(false)
        }
      }
    }

    fetchViews()

    return () => {
      isMounted = false
    }
  }, [postId, skip])

  return { views, isLoading, error }
}
