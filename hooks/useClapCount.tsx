"use client"

import { useEffect, useState, useCallback } from 'react'

interface UseClapCountReturn {
  claps: number
  isLoading: boolean
  error: string | null
  addClap: (amount?: number) => Promise<void>
  isClapping: boolean
}

/**
 * Client-side hook for clap functionality using API routes
 * Fetches current clap count and provides function to add claps
 */
export function useClapCount(postId: string): UseClapCountReturn {
  const [claps, setClaps] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isClapping, setIsClapping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial clap count from API
  useEffect(() => {
    let isMounted = true

    async function fetchClaps() {
      try {
        const response = await fetch(`/api/claps?id=${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch claps')
        }

        const data = await response.json()

        if (isMounted) {
          setClaps(data.clapCount ?? 0)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch claps:', err)
        if (isMounted) {
          setError('Failed to load clap count')
          setIsLoading(false)
        }
      }
    }

    fetchClaps()

    return () => {
      isMounted = false
    }
  }, [postId])

  // Function to add claps via API
  const addClap = useCallback(async (amount: number = 1) => {
    setIsClapping(true)
    
    try {
      const response = await fetch(`/api/claps?id=${postId}&score=${amount}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please slow down!')
        }
        throw new Error('Failed to add clap')
      }

      const data = await response.json()
      setClaps(data.clapCount)
      setError(null)
    } catch (err) {
      console.error('Failed to add clap:', err)
      setError(err instanceof Error ? err.message : 'Failed to add clap')
      // Optimistic update on error
      setClaps(prev => prev + amount)
    } finally {
      setIsClapping(false)
    }
  }, [postId])

  return { claps, isLoading, error, addClap, isClapping }
}
