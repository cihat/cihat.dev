"use client"

import { memo, useMemo, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { BsLink45Deg as ExternalLinkIcon } from "react-icons/bs"
import { GiHamburger } from "react-icons/gi"

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
import useIsMobile from "@/hooks/useIsMobile"

// Navigation menu items - moved outside component to prevent recreation
const NAVIGATION_ITEMS = {
  "/": "Home",
  "/reading": "Reading",
  "/bookmarks": "Bookmarks",
  "/about": "About",
  "https://cv.cihat.dev/": "CV",
  "https://sketchbook.cihat.dev/": "Sketchbook",
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
      className="mr-2 cursor-pointer"
      onClick={onClick}
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className="w-full justify-start cursor-pointer"
      >
        {isExternal && <ExternalLinkIcon size={18} className="mr-1" />}
        {value}
      </Button>
    </NextLink>
  )
})

MenuItem.displayName = 'MenuItem'

// Memoized dropdown component to prevent re-renders
interface NavigationDropdownProps {
  menuItems: { [key: string]: string };
  currentPath: string;
  children: React.ReactNode;
}

const NavigationDropdown = memo(({ menuItems, currentPath, children }: NavigationDropdownProps) => {
  const [open, setOpen] = useState(false)
  const currentLabel = menuItems[currentPath] || <GiHamburger size={20} />

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="text-md font-semibold h-9 p-2">
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4" align="start" side="bottom">
        <DropdownMenuLabel>Pages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col">
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

NavigationDropdown.displayName = 'NavigationDropdown'

export default function Header() {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Normalize path - wrapped in useMemo to prevent recalculation on every render
  const currentPath = useMemo(() => {
    const clearSlash = pathname?.split("/")[1]
    return clearSlash ? `/${clearSlash}` : "/"
  }, [pathname])

  // Close dropdown when a menu item is clicked
  const handleMenuItemClick = () => {
    if (isMobile) {
      setDropdownOpen(false)
    }
  }

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
    <NavigationDropdown
      menuItems={NAVIGATION_ITEMS}
      currentPath={currentPath}
    >
      {navigationLinks}
    </NavigationDropdown>
  ), [currentPath, navigationLinks])

  const desktopNavigation = useMemo(() => (
    <div className="flex left-animation">
      {navigationLinks}
    </div>
  ), [navigationLinks])

  return (
    <Container
      className="flex justify-between px-0 select-none items-center p-4 pb-2 sm:pb-0 relative z-40"
      as="header"
    >
      <Logo />

      <nav className="flex-col gap-3 sm:!flex sm:flex-row items-center sm:justify-center relative ml-auto mr-4">
        {isMobile ? (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="text-md font-semibold h-9 p-2">
                {NAVIGATION_ITEMS[currentPath] || <GiHamburger size={20} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4" align="start" side="bottom">
              <DropdownMenuLabel>Pages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col">
                {navigationLinks}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : desktopNavigation}
      </nav>

      <ThemeToggle />
    </Container>
  )
}
