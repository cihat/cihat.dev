import { initialQuote } from "@/lib/meta"

export default async function getQuote() {
  const stoicApiPath = process.env.STOIC_API_PATH

  // API path yoksa fallback kullan
  if (!stoicApiPath) {
    return initialQuote
  }

  try {
    const response = await fetch(stoicApiPath, { 
      method: "GET",
      signal: AbortSignal.timeout(3000)
    })
    
    if (!response.ok) {
      console.warn(`⚠️  Stoic API request failed: ${response.status} ${response.statusText}`)
      return initialQuote
    }
    
    const data = await response.json()
    
    if (!data) return initialQuote
    
    // API response formatını kontrol et
    if (data.quote || data.text) {
      return {
        text: data.quote || data.text || data.message,
        author: data.author || data.by || "Stoic Philosopher"
      }
    }
    
    return data
  } catch (error) {
    console.warn('⚠️  Failed to fetch stoic quote:', error)
    return initialQuote
  }
}
