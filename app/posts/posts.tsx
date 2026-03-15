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
    showInProgress,
    toggleSort, 
    setCategory, 
    toggleLanguage,
    setSearchInput,
    setShowPersonal,
    setShowInProgress,
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
        showInProgress={showInProgress}
        posts={posts}
        onSortToggle={toggleSort}
        onCategoryChange={setCategory}
        onLanguageToggle={toggleLanguage}
        onSearchChange={setSearchInput}
        onShowPersonalChange={setShowPersonal}
        onShowInProgressChange={setShowInProgress}
      />
      
      <PostList posts={filteredAndSortedPosts} />
    </div>
  );
}
