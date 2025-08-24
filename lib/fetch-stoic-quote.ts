import { initialQuote } from "@/lib/meta"

// Local stoic quotes - daha hızlı ve güvenilir
const LOCAL_STOIC_QUOTES = [
  {
    text: "The best revenge is not to be like your enemy.",
    author: "Marcus Aurelius"
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius"
  },
  {
    text: "It is not death that a man should fear, but he should fear never beginning to live.",
    author: "Marcus Aurelius"
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius"
  },
  {
    text: "Choose not to be harmed — and you won't feel harmed. Don't feel harmed — and you haven't been.",
    author: "Marcus Aurelius"
  },
  {
    text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.",
    author: "Marcus Aurelius"
  },
  {
    text: "The only way to happiness is to cease worrying about things which are beyond the power of our will.",
    author: "Epictetus"
  },
  {
    text: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus"
  },
  {
    text: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus"
  },
  {
    text: "Don't explain your philosophy. Embody it.",
    author: "Epictetus"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama"
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  }
]

export default async function getQuote() {
  // Her zaman local quotes'tan rastgele seç - daha hızlı ve güvenilir
  const randomQuote = LOCAL_STOIC_QUOTES[Math.floor(Math.random() * LOCAL_STOIC_QUOTES.length)]
  return randomQuote
}
