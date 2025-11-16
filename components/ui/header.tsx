"use client"

import { memo, useMemo, useState, useCallback } from "react"
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

// Navigation menu items - moved outside component to prevent recreation
const NAVIGATION_ITEMS = {
  "/reading": "Reading",
  "/bookmarks": "Bookmarks",
  "https://apps.cihat.dev/": "Apps",
  "https://cv.cihat.dev/": "CV",
  "/about": "About",
}

// Memoized menu item component to prevent unnecessary re-renders
interface MenuItemProps {
  value: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const MenuItem = memo(({ value, href, isActive, onClick }: MenuItemProps) => {
  const isExternal = String(href).startsWith("http")

  return (
    <NextLink
      target={isExternal ? "_blank" : "_self"}
      href={href}
      className="mr-0 sm:mr-2 cursor-pointer"
      onClick={onClick}
      title={`${value} - ${isExternal ? 'Opens in new tab' : 'Navigate to'} ${value} page`}
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className="w-full justify-start cursor-pointer text-sm sm:text-base min-h-[44px] sm:min-h-auto"
      >
        {isExternal && <ExternalLinkIcon size={18} className="mr-1 flex-shrink-0" />}
        {value}
      </Button>
    </NextLink>
  )
})

MenuItem.displayName = 'MenuItem'

export default function Header() {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Normalize path - wrapped in useMemo to prevent recalculation on every render
  const currentPath = useMemo(() => {
    const clearSlash = pathname?.split("/")[1]
    return clearSlash ? `/${clearSlash}` : "/"
  }, [pathname])

  // Close dropdown when a menu item is clicked
  const handleMenuItemClick = useCallback(() => {
    setDropdownOpen(false)
  }, [])

  // Generate menu items - memoized to prevent recreation on every render
  const navigationLinks = useMemo(() => {
    return Object.entries(NAVIGATION_ITEMS).map(([key, value]) => (
      <MenuItem
        key={key}
        value={value}
        href={key}
        isActive={key === currentPath}
        onClick={handleMenuItemClick}
      />
    ))
  }, [currentPath, handleMenuItemClick])

  // Memoize the mobile and desktop navigation to prevent re-renders
  const mobileNavigation = useMemo(() => (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="text-sm sm:text-md font-semibold h-9 sm:h-10 px-3 sm:px-4 min-w-[44px] sm:min-w-auto">
          {NAVIGATION_ITEMS[currentPath] || <HiMenu size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[calc(100vw-2rem)] max-w-56 mr-2 sm:mr-4" 
        align="end" 
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuLabel>Pages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col">
          {navigationLinks}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ), [currentPath, navigationLinks, dropdownOpen])

  const desktopNavigation = useMemo(() => (
    <div className="flex left-animation gap-1 sm:gap-2">
      {navigationLinks}
    </div>
  ), [navigationLinks])

  return (
    <Container
      className="flex justify-between select-none items-center px-3 sm:px-4 py-3 sm:py-4 pb-2 sm:pb-0 relative z-40 gap-2 sm:gap-4"
      as="header"
    >
      <Logo />

      <nav className="flex items-center justify-center relative ml-auto">
        {/* Mobile navigation - visible on screens smaller than md (768px) */}
        <div className="flex md:hidden">
          {mobileNavigation}
        </div>
        {/* Desktop navigation - visible on md (768px) and larger screens */}
        <div className="hidden md:flex">
          {desktopNavigation}
        </div>
      </nav>

      <div className="flex-shrink-0">
        <ThemeToggle />
      </div>
    </Container>
  )
}
