"use client";

import NextLink from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import ToggleTheme from "@/components/ui/toggle-theme";
import cx from "@/lib/cx";
import Container from "@/components/ui/container";
import { Logo } from "../logo";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  // const [isComponentVisible, setIsComponentVisible] = useState(false);

  const MENU = {
    "/reading": "Reading",
    "/bookmarks": "Bookmarks",
    "/about": "About",
    // "learning": "Learning",
  } as any;

  const pathname = usePathname();

  const clearSlash = pathname?.split("/")[1];
  const path = clearSlash ? `/${clearSlash}` : "/";

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  return (
    <header className="sm:items-start p-4 pb-0">
      <Container className="flex justify-between px-0 select-none sm:items-center">
        <Logo />
        <nav
          className={cx(
            isNavOpen ? "flex bg-[var(--button-bg)]" : "hidden",
            "flex-col gap-3 sm:!flex sm:flex-row items-center grow sm:justify-center",
            isNavOpen ? "absolute top-0 left-0 right-0 w-full flex items-center justify-center py-4 z-[999] h-1/4 mb-4" : ""
          )}
        >
          {Object.entries(MENU).map(([key, value]) => {
            const isActive = key === path;
            return (
              <span key={key} className="mb-2 md:mb-0">
                <NextLink href={key} onClick={() => setIsNavOpen(false)}
                  className={cx(
                    "text-zinc-900 dark:text-zinc-50 hover:bg-[#eceece] hover:dark:bg-[#2a2a2a] p-2 m-2 md:m-0 rounded transition",
                    isActive ? "bg-[#eceece] dark:bg-[#2a2a2a] rounded hover:" : ""
                  )}
                >
                  {value as string}
                </NextLink>
              </span>
            );
          })}
        </nav>
        {!isNavOpen && (
          <button
            type="button"
            className="flex items-start justify-center sm:hidden p-2 pt-0"
            onClick={() => {
              setIsNavOpen(true);
            }}
          >
            <span>{MENU[path]}</span>
            &nbsp;↓&nbsp;
          </button>
        )}
        <ToggleTheme />
      </Container>
    </header>
  );
}