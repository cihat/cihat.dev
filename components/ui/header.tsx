"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ToggleTheme from "@/components/ui/toggle-theme";
import cx from "@/lib/cx";
import Container from "@/components/ui/container";
import { Logo } from "../logo";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const MENU = {
    "/reading": "Reading",
    // "learning": "Learning",
    "/about": "About",
    "/projects": "Projects",
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
            isNavOpen ? "flex" : "hidden",
            "flex-col gap-3 sm:!flex sm:flex-row items-center grow sm:justify-center"
          )}
        >
          {Object.entries(MENU).map(([key, value]) => {
            const isActive = key === path;
            return (
              <span key={key}>
                <NextLink href={key} className={cx("text-zinc-900 dark:text-zinc-50 hover:bg-[#eceece] hover:dark:bg-[#2a2a2a] p-2 rounded transition", isActive ? "bg-[#eceece] dark:bg-[#2a2a2a] p-2 rounded hover:" : "")}>
                  {value as string}
                </NextLink>
              </span>
            );
          })}
        </nav>
        {!isNavOpen && (
          <button
            type="button"
            className="flex items-start justify-center sm:hidden p-2"
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