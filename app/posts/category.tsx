"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CategoryEnum } from "@/types"

export default function Category({ category, setCategory }) {
  function handleCategory(category: CategoryEnum) {
    switch (category) {
      case CategoryEnum.learning: {
        setCategory(CategoryEnum.learning)
        break;
      }
      case CategoryEnum.philosophy: {
        setCategory(CategoryEnum.philosophy)
        break;
      }
      case CategoryEnum.productivity: {
        setCategory(CategoryEnum.productivity)
        break;
      }
      case CategoryEnum.etc: {
        setCategory(CategoryEnum.etc)
        break;
      }
      case CategoryEnum.all: {
        setCategory(CategoryEnum.all)
        break;
      }
      default: {
        setCategory(CategoryEnum.all)
        break;
      }
    }
  }

  return (
    <div className="mx-2 bg-[#f2f2f2] dark:bg-[#1C1C1C]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="min-w-20">{category}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleCategory(CategoryEnum.all)}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCategory(CategoryEnum.learning)}>
              Learning Series
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCategory(CategoryEnum.philosophy)}>
              Philosophy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCategory(CategoryEnum.productivity)}>
              Productivity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCategory(CategoryEnum.etc)}>
              Etc
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
