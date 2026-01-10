"use client";

import type { Post } from "@/types";
import { usePostFilters } from "@/app/hooks";
import { PostsHeader, PostList } from "./components";

export function Posts({ posts }: { posts: Post[] }) {
  const { 
    sort, 
    category, 
    flag,
    searchInput,
    showPersonal,
    toggleSort, 
    setCategory, 
    toggleLanguage,
    setSearchInput,
    setShowPersonal,
    filteredAndSortedPosts 
  } = usePostFilters(posts);

  return (
    <div className="left-animation text-sm no-scrollbar grow overflow-y-scroll h-full">
      <PostsHeader
        sort={sort}
        category={category}
        flag={flag}
        searchInput={searchInput}
        showPersonal={showPersonal}
        posts={posts}
        onSortToggle={toggleSort}
        onCategoryChange={setCategory}
        onLanguageToggle={toggleLanguage}
        onSearchChange={setSearchInput}
        onShowPersonalChange={setShowPersonal}
      />
      
      <PostList posts={filteredAndSortedPosts} />
    </div>
  );
}
