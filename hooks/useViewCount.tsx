"use client"

import { useEffect, useState } from 'react'
import { executeClientRedisCommand } from '@/lib/redis-client'

interface UseViewCountReturn {
  views: number
  isLoading: boolean
  error: string | null
}

/**
 * Client-side hook for tracking and displaying view counts
 * Automatically increments view count on mount
 */
export function useViewCount(postId: string): UseViewCountReturn {
  const [views, setViews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function trackView() {
      try {
        // Increment view count
        const newViews = await executeClientRedisCommand(
          (redis) => redis.hincrby("views", postId, 1),
          0,
          2000
        )

        if (isMounted) {
          setViews(newViews)
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
  }, [postId])

  return { views, isLoading, error }
}

/**
 * Hook to only fetch view count without incrementing
 */
export function useViewCountRead(postId: string): UseViewCountReturn {
  const [views, setViews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchViews() {
      try {
        const currentViews = await executeClientRedisCommand(
          (redis) => redis.hget<number>("views", postId),
          0,
          2000
        )

        if (isMounted) {
          setViews(currentViews ?? 0)
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
  }, [postId])

  return { views, isLoading, error }
}
