"use client";

import { useEffect, useState, useCallback } from "react";
import { themeEffect } from "@/lib/theme-effect";
import Image from "next/image";
import { Monitor } from "lucide-react";

export function ThemeToggle() {
  const [preference, setPreference] = useState<undefined | null | string>(undefined);
  const [currentTheme, setCurrentTheme] = useState<null | string>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringOverride, setIsHoveringOverride] = useState(false);

  const onMediaChange = useCallback(() => {
    const current = themeEffect();
    setCurrentTheme(current);
  }, []);

  useEffect(() => {
    setPreference(localStorage.getItem("theme"));
    const current = themeEffect();
    setCurrentTheme(current);

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    matchMedia.addEventListener("change", onMediaChange);
    return () => matchMedia.removeEventListener("change", onMediaChange);
  }, [onMediaChange]);

  const onStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === "theme") setPreference(event.newValue);
    },
    [setPreference]
  );

  useEffect(() => {
    setCurrentTheme(themeEffect());
  }, [preference]);

  useEffect(() => {
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  });

  return (
    <div className="flex justify-end items-start md:items-center md:w-24">
      {isHovering && (
        <span
          className={`
            mr-4
            text-[9px]
            text-gray-400
            /* mobile */
            hidden
            md:inline
          `}
        >
          {preference === null ? "System" : preference === "dark" ? "Dark" : "Light"}
        </span>
      )}
      <button
        aria-label="Toggle theme"
        className={`inline-flex ${isHovering && !isHoveringOverride ? "bg-gray-200 dark:bg-[#313131]" : ""} active:bg-gray-300 transition-[background-color] dark:active:bg-[#242424] rounded-sm p-2 
          bg-gray-200
          dark:bg-[#313131]
          theme-system:!bg-inherit
        }`}
        onClick={(ev) => {
          ev.preventDefault();
          // prevent the hover state from rendering
          setIsHoveringOverride(true);

          let newPreference: string | null;
          
          // Cycle through: light -> dark -> system (null)
          if (preference === "light") {
            newPreference = "dark";
            localStorage.setItem("theme", "dark");
          } else if (preference === "dark") {
            newPreference = null;
            localStorage.removeItem("theme");
          } else {
            newPreference = "light";
            localStorage.setItem("theme", "light");
          }
          
          setPreference(newPreference);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsHoveringOverride(false);
        }}
      >
        {/* Light mode - Sun icon */}
        {preference === "light" && (
          <span className="sun-icon">
            <Image width={20} height={20} src="/icons/sun.svg" alt="sun" title="Light mode icon" />
          </span>
        )}
        
        {/* Dark mode - Moon icon */}
        {preference === "dark" && (
          <span className="moon-icon">
            <Image width={20} height={20} src="/icons/moon.svg" alt="moon" title="Dark mode icon" />
          </span>
        )}
        
        {/* System mode - Monitor icon (when preference is null or undefined) */}
        {(preference === null || preference === undefined) && (
          <span className="system-icon" title="System mode - follows your device settings">
            <Monitor size={20} className="text-gray-700 dark:text-gray-300" />
          </span>
        )}
      </button>
    </div>
  );
}
