import { useState, useMemo, useCallback, useEffect } from "react";
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

const STORAGE_KEY_PERSONAL = "cihat.dev.posts.showPersonal";
const STORAGE_KEY_IN_PROGRESS = "cihat.dev.posts.showInProgress";

/**
 * Unified hook for filtering, sorting, and searching blog posts
 * Handles language, category, date sorting, and fuzzy search.
 * Personal and In progress states are persisted in localStorage (survives tab switch, refresh).
 * @param posts - Array of all posts
 * @returns Filter states, setters, and filtered posts
 */
export function usePostFilters(posts: Post[]) {
  const searchParams = useSearchParams();

  const [sort, setSort] = useState<SortSetting>(["date", "desc"]);
  const [lang, setLang] = useState<LangEnum>(LangEnum.all);
  const [category, setCategory] = useState<CategoryEnum>(() => {
    const fromUrl = searchParams.get("category");
    if (!fromUrl || fromUrl === "All") return CategoryEnum.all;
    return fromUrl as CategoryEnum;
  });
  const [searchInput, setSearchInput] = useState("");
  const [showPersonalState, setShowPersonalState] = useState<boolean>(false);
  const [showInProgressState, setShowInProgressState] = useState<boolean>(false);

  // Restore visibility from localStorage on mount (and when returning to posts e.g. from Writing tab)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const personal = window.localStorage.getItem(STORAGE_KEY_PERSONAL);
    const inProgress = window.localStorage.getItem(STORAGE_KEY_IN_PROGRESS);
    setShowPersonalState(personal === "1");
    setShowInProgressState(inProgress === "1");
  }, []);

  // Sync category from URL on back/forward
  useEffect(() => {
    const cat = searchParams.get("category");
    setCategory(
      !cat || cat === "All" || cat === "All posts" ? CategoryEnum.all : (cat as CategoryEnum)
    );
  }, [searchParams]);

  const setShowPersonal = useCallback((value: boolean) => {
    setShowPersonalState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_PERSONAL, value ? "1" : "0");
    }
  }, []);

  const setShowInProgress = useCallback((value: boolean) => {
    setShowInProgressState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_IN_PROGRESS, value ? "1" : "0");
    }
  }, []);

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
      filtered = filtered.filter((post) => {
        const postCategories = Array.isArray(post.category) ? post.category : [post.category];
        return postCategories.some((cat) => cat.toLowerCase() === category.toLowerCase());
      });
    }
    
    // 4. Apply Personal filter (exclude Personal posts if showPersonalState is false)
    if (!showPersonalState) {
      filtered = filtered.filter((post) => {
        const postCategories = Array.isArray(post.category) ? post.category : [post.category];
        return !postCategories.some((cat) => cat.toLowerCase() === 'personal');
      });
    }

    // 5. Apply InProgress filter (exclude yarım kalan yazılar if showInProgressState is false)
    if (!showInProgressState) {
      filtered = filtered.filter((post) => !post.inProgress);
    }
    
    // 6. Finally sort
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [posts, sort, lang, category, searchInput, showPersonalState, showInProgressState]);

  return {
    sort,
    lang,
    category,
    flag: currentFlag,
    searchInput,
    showPersonal: showPersonalState,
    showInProgress: showInProgressState,
    setLang,
    setCategory,
    setSearchInput,
    setShowPersonal,
    setShowInProgress,
    toggleSort,
    toggleLanguage,
    filteredAndSortedPosts,
  };
}

