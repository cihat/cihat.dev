"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AiOutlineArrowDown } from "react-icons/ai";
import { DarkModeButton } from "@/components";

import cx from "@/lib/cx";
import { Container } from "@/components";

const MENU = {
  "/": "About",
  "/projects": "Projects",
} as any;

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const pathname = usePathname();

  const clearSlash = pathname?.split("/")[1];
  const path = clearSlash ? `/${clearSlash}` : "/";

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  return (
    <header className="">
      <Container className="justify-between">
        <nav
          className={cx(
            isNavOpen ? "flex" : "hidden",
            "flex-col gap-3 sm:!flex sm:flex-row"
          )}
        >
          {Object.entries(MENU).map(([key, value]) => {
            const isActive = key === path;
            return (
              <span key={key}>
                <NextLink href={key} className={cx(isActive ? "shine" : "")}>
                  {value as string}
                </NextLink>
              </span>
            );
          })}
          <DarkModeButton className="inline-block ml-auto" />
        </nav>

        {!isNavOpen && (
          <button
            type="button"
            className="flex select-none items-center sm:hidden"
            onClick={() => {
              setIsNavOpen(true);
            }}
          >
            <span>{MENU[path]}</span>
            <AiOutlineArrowDown />
          </button>
        )}
      </Container>
    </header>
  );
}