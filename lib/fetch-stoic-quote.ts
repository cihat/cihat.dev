import { initialQuote } from "@/lib/meta"

export default async function getQuote() {
  const stoicApiPath = process.env.STOIC_API_PATH as string

  if (process.env.NODE_ENV === "development") return initialQuote

  return await fetch(stoicApiPath, { method: "GET" })
    .then(res => res.json())
    .then(data => {
      if (!data) return initialQuote
      return data
    })
}
