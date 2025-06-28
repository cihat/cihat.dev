import { initialQuote } from "@/lib/meta"

export default async function getQuote() {
  const stoicApiPath = process.env.STOIC_API_PATH as string

  // Don't make external calls during development or build time
  if (process.env.NODE_ENV === "development" || 
      process.env.NEXT_PHASE === "phase-production-build" ||
      !stoicApiPath) {
    return initialQuote
  }

  try {
    return await fetch(stoicApiPath, { method: "GET" })
      .then(res => {
        if (!res.ok) {
          console.warn(`⚠️  Stoic API request failed: ${res.status} ${res.statusText}`)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (!data) return initialQuote
        return data
      })
  } catch (error) {
    console.warn('⚠️  Failed to fetch stoic quote:', error)
    return initialQuote
  }
}
