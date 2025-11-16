import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryEnum } from "@/types";
import { useRouter } from 'next/navigation';

interface CategoryProps {
  category: CategoryEnum;
  setCategory: (category: CategoryEnum) => void;
}

export default function Category({ category, setCategory }: CategoryProps) {
  const router = useRouter();

  const categories = Object.values(CategoryEnum);
  const handleCategory = (category: CategoryEnum) => {
    setCategory(category);
    router.push(`/?category=${category}`)
  }


  return (
    <div className="mx-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="min-w-fit px-3 h-9 rounded-sm text-left text-md font-semibold whitespace-nowrap">
            {category}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {categories.map((c) => (
              <DropdownMenuItem key={c} onClick={() => handleCategory(c as CategoryEnum)}>{c}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  );
}
