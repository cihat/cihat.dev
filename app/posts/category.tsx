import React, { useMemo } from "react";
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
import type { Post } from "@/types";
import { useRouter } from 'next/navigation';

interface CategoryProps {
  category: CategoryEnum;
  setCategory: (category: CategoryEnum) => void;
  posts: Post[];
}

export default function Category({ category, setCategory, posts }: CategoryProps) {
  const router = useRouter();

  // Extract unique categories from posts
  const usedCategories = useMemo(() => {
    const categorySet = new Set<string>();
    
    posts.forEach((post) => {
      const postCategories = Array.isArray(post.category) ? post.category : [post.category];
      postCategories.forEach((cat) => {
        categorySet.add(cat);
      });
    });
    
    return Array.from(categorySet);
  }, [posts]);

  // Filter CategoryEnum to only show categories that exist in posts
  // Map category strings to CategoryEnum values (case-insensitive)
  const availableCategories = useMemo(() => {
    const categories = [CategoryEnum.all]; // Always include "All"
    
    // Map used categories to CategoryEnum values
    const categoryMap = new Map<string, CategoryEnum>();
    Object.values(CategoryEnum).forEach((enumValue) => {
      categoryMap.set(enumValue.toLowerCase(), enumValue);
    });
    
    usedCategories.forEach((usedCat) => {
      const enumValue = categoryMap.get(usedCat.toLowerCase());
      if (enumValue && enumValue !== CategoryEnum.all) {
        categories.push(enumValue);
      }
    });
    
    // Sort remaining categories alphabetically (excluding "All")
    const sorted = categories.slice(1).sort((a, b) => a.localeCompare(b));
    return [CategoryEnum.all, ...sorted];
  }, [usedCategories]);

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
            {availableCategories.map((c) => (
              <DropdownMenuItem key={c} onClick={() => handleCategory(c as CategoryEnum)}>{c}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  );
}
