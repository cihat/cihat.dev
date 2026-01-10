import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Category from "../category";
import { CategoryEnum } from "@/types";
import type { SortSetting } from "@/app/hooks";

/**
 * Header component for the posts list with filtering controls
 */
interface PostsHeaderProps {
  sort: SortSetting;
  category: CategoryEnum;
  flag: string;
  searchInput: string;
  showPersonal: boolean;
  posts: any[]; // Post[] type, but using any to avoid circular import
  onSortToggle: () => void;
  onCategoryChange: (category: CategoryEnum) => void;
  onLanguageToggle: () => void;
  onSearchChange: (value: string) => void;
  onShowPersonalChange: (value: boolean) => void;
}

export function PostsHeader({
  sort,
  category,
  flag,
  searchInput,
  showPersonal,
  posts,
  onSortToggle,
  onCategoryChange,
  onLanguageToggle,
  onSearchChange,
  onShowPersonalChange,
}: PostsHeaderProps) {
  return (
    <header className="flex items-center text-sm sticky top-0 p-1 rounded-md bg-white dark:bg-black">
      <Button
        variant="outline"
        size="sm"
        onClick={onSortToggle}
        className="w-13 h-9 text-left text-md font-semibold"
      >
        Date
        {sort[0] === "date" && sort[1] === "asc" && "↑"}
      </Button>
      
      <div className="grow pl-2">
        <Input
          type="text"
          placeholder="Search posts..."
          className="w-full"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Category category={category} setCategory={onCategoryChange} posts={posts} />
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onShowPersonalChange(!showPersonal)}
        className={`cursor-pointer flex items-center justify-center h-9 text-md font-semibold px-3 mr-2 hover:bg-transparent hover:text-current dark:hover:bg-input/30 dark:hover:text-current ${
          showPersonal ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : ''
        }`}
        title="Show Personal posts"
      >
        Personal
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onLanguageToggle}
        className="flex items-center justify-center h-9 text-md font-semibold w-16 mr-2"
      >
        {flag}
      </Button>
    </header>
  );
}

