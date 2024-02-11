"use client";

import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ToggleTheme from "@/components/ui/toggle-theme";
import cx from "@/lib/cx";
import Container from "@/components/ui/container";
import { Logo } from "../logo";

function useOutsideAlerter(ref, setIsNavOpen) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    }

    function handleTouchMove(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref]);
}


export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsNavOpen);

  const MENU = {
    "/reading": "Reading",
    "/bookmarks": "Bookmarks",
    "/about": "About",
  } as any;

  const pathname = usePathname();

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
            isNavOpen ? "absolute top-0 left-0 right-0 w-full flex items-center justify-center py-4 z-[999] h-1/4 mb-4" : ""
          )}
        >
          {Object.entries(MENU).map(([key, value]) => {
            const isActive = key === path;
            return (
              <span key={key} className="mb-2 md:mb-0 font-semibold text-lg">
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
          <span onClick={() => setIsNavOpen(false)} className={cx("absolute right-2 top-2 bg-gray-200 dark:bg-[#313131] font-bold p-2 text-lg rounded-md", isNavOpen ? "flex bg-[var(--button-bg)]" : "hidden",)}>❎</span>
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
        <ToggleTheme />
      </Container>
    </header>
  );
}
