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
import { useSearchParams } from 'next/navigation';

interface CategoryProps {
  category: CategoryEnum;
  setCategory: (category: CategoryEnum) => void;
}

export default function Category({ category, setCategory }: CategoryProps) {
  const searchParams = useSearchParams();
  const categories = Object.keys(CategoryEnum);
  const categoryFromUrl = searchParams.get('category');

  const handleCategory = (category: CategoryEnum) => {
    console.log('categories key veli sadf ', categories, category)
    setCategory(category);
    if (categoryFromUrl) {
      const params = new URLSearchParams();
      params.set('category', categoryFromUrl);
    }
  }

  // useEffect(() => {
  //   if (categoryFromUrl && categories.includes(categoryFromUrl as CategoryEnum)) {
  //     setCategory(CategoryEnum[categoryFromUrl] as CategoryEnum);
  //     return
  //   }

  //   setCategory(CategoryEnum.all);
  // }, [categoryFromUrl, categories, setCategory]);


  return (
    <div className="mx-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-13 h-9 rounded-sm text-left text-md font-semibold">
            {category}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup><a href=""></a>
            {categories.map((c) => (
              <DropdownMenuItem key={c} onClick={() => handleCategory(c as CategoryEnum)}>{c}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  );
}
