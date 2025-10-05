"use client"

import { useEffect, useState, useCallback } from 'react'
import { executeClientRedisCommand } from '@/lib/redis-client'

interface UseClapCountReturn {
  claps: number
  isLoading: boolean
  error: string | null
  addClap: (amount?: number) => Promise<void>
  isClapping: boolean
}

/**
 * Client-side hook for clap functionality
 * Fetches current clap count and provides function to add claps
 */
export function useClapCount(postId: string): UseClapCountReturn {
  const [claps, setClaps] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isClapping, setIsClapping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial clap count
  useEffect(() => {
    let isMounted = true

    async function fetchClaps() {
      try {
        const currentClaps = await executeClientRedisCommand(
          (redis) => redis.hget<number>("claps", postId),
          0,
          2000
        )

        if (isMounted) {
          setClaps(currentClaps ?? 0)
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

  // Function to add claps
  const addClap = useCallback(async (amount: number = 1) => {
    setIsClapping(true)
    
    try {
      const newClaps = await executeClientRedisCommand(
        (redis) => redis.hincrby("claps", postId, amount),
        claps + amount,
        2000
      )

      setClaps(newClaps)
      setError(null)
    } catch (err) {
      console.error('Failed to add clap:', err)
      setError('Failed to add clap')
      // Optimistic update on error
      setClaps(prev => prev + amount)
    } finally {
      setIsClapping(false)
    }
  }, [postId, claps])

  return { claps, isLoading, error, addClap, isClapping }
}
