import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
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
  showPersonal: boolean;
  showInProgress: boolean;
  onShowPersonalChange: (value: boolean) => void;
  onShowInProgressChange: (value: boolean) => void;
}

export default function Category({
  category,
  setCategory,
  posts,
  showPersonal,
  showInProgress,
  onShowPersonalChange,
  onShowInProgressChange,
}: CategoryProps) {
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
  };

  // When all filters are default (All posts + no Personal/In progress), show short "All" on the button
  const isAllDefault = category === CategoryEnum.all && !showPersonal && !showInProgress;
  const buttonLabel = isAllDefault ? "All" : category;

  return (
    <div className="mx-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="min-w-fit px-3 h-9 rounded-sm text-left text-md font-semibold whitespace-nowrap">
            {buttonLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Visibility</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showPersonal}
            onCheckedChange={onShowPersonalChange}
            onSelect={(e) => e.preventDefault()}
          >
            Personal
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showInProgress}
            onCheckedChange={onShowInProgressChange}
            onSelect={(e) => e.preventDefault()}
          >
            In progress
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuGroup>
            {availableCategories.map((c) => (
              <DropdownMenuItem
                key={c}
                onSelect={(e) => {
                  e.preventDefault();
                  handleCategory(c as CategoryEnum);
                }}
              >
                {c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  );
}
