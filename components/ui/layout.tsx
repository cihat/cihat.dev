import clsx from 'clsx'
import Link from 'next/link'

export type Item = {
  title: string
  href: string
}

const headerItems: Item[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Press', href: '/press' },
  { title: 'Contact', href: '/contact' },
]
const footerItems: Item[] = [
  { title: 'Press', href: '/press' },
  { title: 'Contact', href: '/contact' },
]


export function Header() {
  return (
    <header>
      <div className="flex justify-between items-center py-4">
        Header
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="flex justify-between items-center py-4">
        Footer
      </div>
    </footer>
  )
}