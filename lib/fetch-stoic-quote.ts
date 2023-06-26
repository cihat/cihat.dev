import { initalQuote } from "@/lib/meta"

export default async function getQuote() {
  const stoicApiPath = process.env.STOIC_API_PATH as string

  // if (process.env.NODE_ENV === "development") return initalQuote

  return await fetch("https://stoic-quotes.com/api/quote", { method: "GET" })
    .then(res => res.json())
    .then(data => {
      if (!data) return initalQuote
      return data
    })
}