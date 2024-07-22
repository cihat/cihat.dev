"use client";

import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
//@ts-ignore
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import cx from "@/lib/cx";
import Container from "@/components/ui/container";
import { Logo } from "../logo";
import Link from "next/link";
import { BsLink45Deg } from "react-icons/bs";
import useOutsideAlerter from "@/hooks/useComponentVisible"

const MENU = {
  "/": "Home",
  "/reading": "Reading",
  "/bookmarks": "Bookmarks",
  "/about": "About",
} as any;

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const wrapperRef = useRef(null);
  const pathname = usePathname();

  useOutsideAlerter(wrapperRef);

  const clearSlash = pathname?.split("/")[1];
  const path = clearSlash ? `/${clearSlash}` : "/";

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  return (
    <header className="sm:items-start p-4 pb-2 sm:pb-0">
      <Container className="flex justify-between px-0 select-none items-center">
        <Logo />
        <nav
          ref={wrapperRef}
          className={cx(
            isNavOpen ? "flex bg-[var(--button-bg)]" : "hidden",
            "flex-col gap-3 sm:!flex sm:flex-row items-center grow sm:justify-center relative",
            isNavOpen ? "absolute top-0 left-0 right-0 w-full flex items-center justify-center py-4 z-[999] h-2/4 mb-4" : ""
          )}
        >
          {Object.entries(MENU).map(([key, value]) => {
            const isActive = key === path;
            return (
              <NextLink href={key} onClick={() => setIsNavOpen(false)} key={key}
                className={cx(
                  "font-semibold text-lg text-zinc-900 dark:text-zinc-50 hover:bg-[#eceece] hover:dark:bg-[#2a2a2a] p-2 mx-2 md:m-0 rounded transition",
                  isActive ? "bg-[#eceece] dark:bg-[#2a2a2a] rounded hover:" : ""
                )}
              >
                {value as string}
              </NextLink>
            );
          })}
          <Link href="https://cv.cihat.dev/" target={"_blank"} className={"flex justify-center items-center font-bold text-zinc-900 dark:text-zinc-50 hover:bg-[#eceece] hover:dark:bg-[#2a2a2a]  rounded transition p-2 mx-2 md:m-0"}>
            <BsLink45Deg />&nbsp;CV
          </Link>
          <span onClick={() => setIsNavOpen(false)} className={cx("absolute right-2 top-2 bg-gray-200 dark:bg-[#313131] font-bold p-2 text-lg rounded-md cursor-pointer", isNavOpen ? "flex bg-[var(--button-bg)]" : "hidden",)}>❌</span>
        </nav>
        {!isNavOpen && (
          <button
            type="button"
            className="flex items-start justify-center sm:hidden p-2 bg-gray-200 dark:bg-[#313131] rounded-md"
            onClick={() => {
              setIsNavOpen(true);
            }}
          >
            <span>{MENU[path]}</span>
            <span className="px-2">↓</span>
          </button>
        )}
        <ThemeToggle />
      </Container>
    </header>
  );
}
