"use client"

import { useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { BsLink45Deg as ExternalLinkIcon } from "react-icons/bs"
import { HiMenu } from "react-icons/hi"
import { ChevronDown } from "lucide-react"

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

const INTERNAL_NAVIGATION = {
  "/": "Writing",
  "/reading": "Reading",
  "/bookmarks": "Bookmarks",
  "/about": "About",
}

const EXTERNAL_NAVIGATION = {
  "https://apps.cihat.dev/": "Apps",
  "https://cv.cihat.dev/": "CV",
}

const ALL_NAVIGATION = { ...INTERNAL_NAVIGATION, ...EXTERNAL_NAVIGATION }

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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [externalDropdownOpen, setExternalDropdownOpen] = useState(false)

  const currentPath = pathname?.split("/")[1] ? `/${pathname.split("/")[1]}` : "/"

  const internalLinks = Object.entries(INTERNAL_NAVIGATION).map(([key, value]) => (
    <MenuItem
      key={key}
      value={value}
      href={key}
      isActive={key === currentPath}
      onClick={() => setMobileDropdownOpen(false)}
    />
  ))

  const externalLinks = Object.entries(EXTERNAL_NAVIGATION).map(([key, value]) => (
    <MenuItem
      key={key}
      value={value}
      href={key}
      isActive={false}
      onClick={() => {
        setMobileDropdownOpen(false)
        setExternalDropdownOpen(false)
      }}
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
          <DropdownMenu open={mobileDropdownOpen} onOpenChange={setMobileDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="h-10 px-4 cursor-pointer">
                {ALL_NAVIGATION[currentPath] || <HiMenu size={20} />}
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
                {internalLinks}
              </DropdownMenuGroup>
              {externalLinks.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className="flex flex-col">
                    {externalLinks}
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex gap-2">
          {internalLinks}
          {externalLinks.length > 0 && (
            <DropdownMenu open={externalDropdownOpen} onOpenChange={setExternalDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm sm:text-base cursor-pointer"
                >
                  More
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuGroup className="flex flex-col">
                  {externalLinks}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>

      <ThemeToggle />
    </Container>
  )
}
