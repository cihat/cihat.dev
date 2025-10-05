"use client"

import { ViewCounter } from '@/components/view-counter'
import { ClapButton } from '@/components/clap-button'
import Container from '@/components/ui/container'

/**
 * Test page for client-side Redis functionality
 * Visit: http://localhost:3000/test-redis
 */
export default function TestRedisPage() {
  const testPostId = "test-redis-post"

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Client-Side Redis Test</h1>
        
        <div className="space-y-8">
          {/* View Counter Test */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">View Counter</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This counter tracks views using client-side Redis.
            </p>
            
            <div className="flex gap-6">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Auto-increment (trackView=true)</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                  <ViewCounter postId={testPostId} trackView={true} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Increments on page load</p>
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Read-only (trackView=false)</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                  <ViewCounter postId={testPostId} trackView={false} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Only displays current count</p>
              </div>
            </div>
          </section>

          {/* Clap Button Test */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Clap Button</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click to clap! You can clap up to 30 times (tracked in localStorage).
            </p>
            
            <div className="flex justify-center">
              <ClapButton postId={testPostId} maxClaps={30} />
            </div>
          </section>

          {/* Instructions */}
          <section className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
            <h2 className="text-xl font-semibold mb-3">✅ Test Checklist</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>View counter should increment automatically</li>
              <li>Read-only counter should match auto-increment counter</li>
              <li>Click clap button multiple times</li>
              <li>Clap count should increase with each click</li>
              <li>User clap count should show (stored in localStorage)</li>
              <li>After 30 claps, button should be disabled</li>
              <li>Refresh page - your clap count should persist</li>
              <li>Open browser console to see Redis logs</li>
            </ol>
          </section>

          {/* Debug Info */}
          <section className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-3">🔍 Debug Info</h2>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Post ID:</span>
                <span className="font-semibold">{testPostId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Redis URL:</span>
                <span className="text-xs truncate max-w-xs">
                  {process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '❌ Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Token:</span>
                <span className="text-xs">
                  {process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN 
                    ? `✅ Set (${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN.substring(0, 10)}...)` 
                    : '❌ Not set'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
              <strong>⚠️ Note:</strong> If you see "Not set" above, make sure you've:
              <ol className="list-decimal list-inside ml-2 mt-1">
                <li>Added NEXT_PUBLIC_UPSTASH_REDIS_REST_URL to .env.local</li>
                <li>Added NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN to .env.local</li>
                <li>Restarted the dev server</li>
              </ol>
            </div>
          </section>

          {/* Actions */}
          <section className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">🎮 Actions</h2>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem(`claps-${testPostId}`)
                  window.location.reload()
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Reset My Claps
              </button>
              
              <button
                onClick={() => {
                  window.location.reload()
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => {
                  console.log('LocalStorage:', {
                    claps: localStorage.getItem(`claps-${testPostId}`),
                  })
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Log to Console
              </button>
            </div>
          </section>

          {/* Documentation */}
          <section className="border rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
            <h2 className="text-xl font-semibold mb-3">📚 Documentation</h2>
            <p className="text-sm mb-2">
              For full documentation and usage examples, see:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">CLIENT_SIDE_REDIS.md</code></li>
              <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">CACHE_FIXES.md</code></li>
              <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">UPSTASH_SETUP.md</code></li>
            </ul>
          </section>
        </div>
      </div>
    </Container>
  )
}
