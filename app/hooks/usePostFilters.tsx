import { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import type { Post } from "@/types";
import { CategoryEnum, LangEnum } from "@/types";
import { useSearchParams } from "next/navigation";

export type SortSetting = ["date" | "views", "desc" | "asc"];

const LANGUAGE_CONFIG = {
  [LangEnum.all]: { next: LangEnum.tr, flag: "🇹🇷🇬🇧" },
  [LangEnum.tr]: { next: LangEnum.en, flag: "🇹🇷" },
  [LangEnum.en]: { next: LangEnum.all, flag: "🇬🇧" },
} as const;

/**
 * Unified hook for filtering, sorting, and searching blog posts
 * Handles language, category, date sorting, and fuzzy search
 * @param posts - Array of all posts
 * @returns Filter states, setters, and filtered posts
 */
export function usePostFilters(posts: Post[]) {
  const searchParams = useSearchParams();

  const [sort, setSort] = useState<SortSetting>(["date", "desc"]);
  const [lang, setLang] = useState<LangEnum>(LangEnum.all);
  const [category, setCategory] = useState<CategoryEnum>(
    (searchParams.get("category") as CategoryEnum) || CategoryEnum.all
  );
  const [searchInput, setSearchInput] = useState("");

  const toggleSort = useCallback(() => {
    setSort((current) => ["date", current[0] !== "date" || current[1] === "asc" ? "desc" : "asc"]);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang((currentLang) => LANGUAGE_CONFIG[currentLang].next);
  }, []);

  const currentFlag = LANGUAGE_CONFIG[lang].flag;

  // Apply all filters in the correct order
  const filteredAndSortedPosts = useMemo(() => {
    const [sortKey, sortDirection] = sort;
    
    // 1. First apply language filter
    let filtered = posts;
    if (lang !== LangEnum.all) {
      filtered = filtered.filter((post) => post.language === lang);
    }
    
    // 2. Then apply search filter (search within language-filtered posts)
    if (searchInput.trim() !== "") {
      // Create a new Fuse instance with the already language-filtered posts
      const languageFilteredFuse = new Fuse(filtered, {
        keys: ["title", "category"],
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 2,
      });
      filtered = languageFilteredFuse.search(searchInput.trim()).map((result) => result.item);
    }
    
    // 3. Then apply category filter
    if (category !== CategoryEnum.all) {
      filtered = filtered.filter((post) => post.category.toLowerCase() === category.toLowerCase());
    }
    
    // 4. Finally sort
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [posts, sort, lang, category, searchInput]);

  return {
    sort,
    lang,
    category,
    flag: currentFlag,
    searchInput,
    setLang,
    setCategory,
    setSearchInput,
    toggleSort,
    toggleLanguage,
    filteredAndSortedPosts,
  };
}

