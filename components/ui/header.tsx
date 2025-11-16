"use client"

import { useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { BsLink45Deg as ExternalLinkIcon } from "react-icons/bs"
import { HiMenu } from "react-icons/hi"

import { ThemeToggle } from "@/components/ui/toggle-theme"
import Container from "@/components/ui/container"
import Logo from "../logo"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const NAVIGATION_ITEMS = {
  "/": "Writing",
  "/reading": "Reading",
  "/bookmarks": "Bookmarks",
  "https://apps.cihat.dev/": "Apps",
  "https://cv.cihat.dev/": "CV",
  "/about": "About",
}

interface MenuItemProps {
  value: string
  href: string
  isActive: boolean
  onClick?: () => void
}

function MenuItem({ value, href, isActive, onClick }: MenuItemProps) {
  const isExternal = href.startsWith("http")

  return (
    <NextLink
      target={isExternal ? "_blank" : "_self"}
      href={href}
      className="sm:mr-2 cursor-pointer"
      onClick={onClick}
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className="w-full sm:w-auto justify-start text-sm sm:text-base cursor-pointer"
      >
        {isExternal && <ExternalLinkIcon size={18} className="mr-1" />}
        {value}
      </Button>
    </NextLink>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const currentPath = pathname?.split("/")[1] ? `/${pathname.split("/")[1]}` : "/"

  const navigationLinks = Object.entries(NAVIGATION_ITEMS).map(([key, value]) => (
    <MenuItem
      key={key}
      value={value}
      href={key}
      isActive={key === currentPath}
      onClick={() => setDropdownOpen(false)}
    />
  ))

  return (
    <Container
      className="flex justify-between items-center px-4 py-4 relative z-40 gap-4"
      as="header"
    >
      <Logo />

      <nav className="flex items-center ml-auto">
        <div className="flex md:hidden">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="h-10 px-4 cursor-pointer">
                {NAVIGATION_ITEMS[currentPath] || <HiMenu size={20} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[calc(100vw-2rem)] max-w-56 mr-4" 
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel>Pages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col">
                {navigationLinks}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex gap-2">
          {navigationLinks}
        </div>
      </nav>

      <ThemeToggle />
    </Container>
  )
}
