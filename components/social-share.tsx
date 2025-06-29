"use client"

import { useState } from 'react'
import { BsTwitter, BsLinkedin, BsLink45Deg, BsCheck2 } from 'react-icons/bs'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=chtslk`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      copyToClipboard()
      return
    }
    
    const shareUrl = shareData[platform as keyof typeof shareData]
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <div className="flex flex-col gap-3 py-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share this article
      </h3>
      <div className="flex gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          title="Share on Twitter"
        >
          <BsTwitter className="w-4 h-4" />
          Twitter
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          title="Share on LinkedIn"
        >
          <BsLinkedin className="w-4 h-4" />
          LinkedIn
        </button>
        
        <button
          onClick={() => handleShare('copy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
          }`}
          title="Copy link"
        >
          {copied ? (
            <>
              <BsCheck2 className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <BsLink45Deg className="w-4 h-4" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  )
} 
