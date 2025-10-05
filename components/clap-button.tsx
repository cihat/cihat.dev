"use client"

import { useClapCount } from '@/hooks/useClapCount'
import commaNumber from 'comma-number'
import { useState, useEffect } from 'react'

interface ClapButtonProps {
  postId: string
  className?: string
  maxClaps?: number
}

/**
 * Client-side clap button component
 * Users can clap multiple times up to maxClaps
 */
export function ClapButton({ 
  postId, 
  className = '',
  maxClaps = 30 
}: ClapButtonProps) {
  const { claps, isLoading, error, addClap, isClapping } = useClapCount(postId)
  const [userClaps, setUserClaps] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)

  // Load user's clap count from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`claps-${postId}`)
    if (stored) {
      setUserClaps(parseInt(stored, 10))
    }
  }, [postId])

  const handleClap = async () => {
    if (userClaps >= maxClaps) {
      return
    }

    const newUserClaps = userClaps + 1
    setUserClaps(newUserClaps)
    localStorage.setItem(`claps-${postId}`, newUserClaps.toString())

    // Trigger animation
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 300)

    await addClap(1)
  }

  if (error) {
    return null
  }

  const canClap = userClaps < maxClaps

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleClap}
        disabled={!canClap || isClapping || isLoading}
        className={`
          relative p-4 rounded-full transition-all duration-200
          ${canClap 
            ? 'bg-green-500 hover:bg-green-600 hover:scale-110 cursor-pointer' 
            : 'bg-gray-400 cursor-not-allowed'
          }
          ${showAnimation ? 'scale-125' : ''}
          disabled:opacity-50
        `}
        aria-label="Clap"
      >
        <span className="text-2xl">👏</span>
        {showAnimation && (
          <span className="absolute -top-2 -right-2 text-xl animate-bounce">
            +1
          </span>
        )}
      </button>
      
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <>
              <span className="font-bold text-lg">{commaNumber(claps)}</span>
              <span className="ml-1">claps</span>
            </>
          )}
        </div>
        <div className="text-xs text-gray-500">
          You: {userClaps}/{maxClaps}
        </div>
      </div>
    </div>
  )
}
