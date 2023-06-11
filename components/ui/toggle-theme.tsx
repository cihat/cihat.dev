"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs"
import cx from "@/lib/cx"

export default function ToggleTheme({ className }: { className: string }) {
  const { systemTheme, theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState("") as any;

  useEffect(() => {
    setCurrentTheme(theme === "system" ? systemTheme : theme === "dark" ? "dark" : "light")
  }, [theme])


  return (
    <div className={cx(className)}>
      {currentTheme === "dark" ? (
        <BsFillSunFill
          className="h-6 w-6 cursor-pointer text-yellow-400"
          onClick={() => {
            setTheme("light")
          }}
        />
      ) : (
        <BsFillMoonFill
          className="h-6 w-6 cursor-pointer text-slate-700"
          onClick={() => {
            setTheme("dark")
          }}
        />
      )}
    </div>
  )
}
