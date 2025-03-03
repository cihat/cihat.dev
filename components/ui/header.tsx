"use client"

import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/toggle-theme"
import Container from "@/components/ui/container"
import Logo from "../logo"
import { BsLink45Deg as ExternalLinkIcon } from "react-icons/bs"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GiHamburger } from "react-icons/gi"
import useIsMobile from "@/hooks/useIsMobile"
// import { mobileWidth } from "@/store/types"
// import { useEffect, useRef, useState } from "react"

const MENU = {
  "/": "Home",
  "/reading": "Reading",
  "/bookmarks": "Bookmarks",
  "/about": "About",
  "https://cv.cihat.dev/": "CV",
  "https://sketchbook.cihat.dev/": "Sketchbook",
}

const MenuItem = ({ value, href, isActive }) => {
  const isExternal = String(href).startsWith("http")

  return (
    <NextLink target={isExternal ? "_blank" : "_self"} href={href} className="mr-2">
      <Button variant={isActive ? "default" : "ghost"} size="sm" className="w-full justify-start ">
        {isExternal && <ExternalLinkIcon size={18} />}
        {value}
      </Button>
    </NextLink>
  )
}

const NavigationDropdown = ({ MENU, path, children }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="text-md font-semibold h-9 p-2">
          {MENU[path] || <GiHamburger size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4" align="start" side="bottom">
        <DropdownMenuLabel>Pages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col">{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Header() {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const clearSlash = pathname?.split("/")[1]
  const path = clearSlash ? `/${clearSlash}` : "/"
  const pages = Object.entries(MENU).map(([key, value]) => <MenuItem key={value} value={value} href={key} isActive={key === path} />)

  return (
    <Container className="flex justify-between px-0 select-none items-center p-4 pb-2 sm:pb-0" as="header">
      <Logo />
      <nav className="flex-col gap-3 sm:!flex sm:flex-row items-center sm:justify-center relative ml-auto mr-4">
        {isMobile ? (
          <NavigationDropdown MENU={MENU} path={path}>
            {pages}
          </NavigationDropdown>
        ) : (
          <div className="flex left-animation">{pages}</div>
        )}
      </nav>
      <ThemeToggle />
    </Container>
  )
}
