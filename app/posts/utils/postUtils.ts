import type { Post } from "@/types";
import { CategoryEnum, LangEnum } from "@/types";

export function filterPostsByLanguage(posts: Post[], lang: LangEnum): Post[] {
  if (lang === LangEnum.all) return posts;
  return posts.filter((post) => post.language === lang);
}

export function filterPostsByCategory(posts: Post[], category: CategoryEnum): Post[] {
  if (category === CategoryEnum.all) return posts;
  return posts.filter((post) => {
    const postCategories = Array.isArray(post.category) ? post.category : [post.category];
    return postCategories.some((cat) => cat.toLowerCase() === category.toLowerCase());
  });
}

export function sortPostsByDate(posts: Post[], direction: "asc" | "desc"): Post[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return direction === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function applyFiltersAndSort(
  posts: Post[],
  lang: LangEnum,
  category: CategoryEnum,
  sortDirection: "asc" | "desc"
): Post[] {
  let filtered = filterPostsByLanguage(posts, lang);
  filtered = filterPostsByCategory(filtered, category);
  return sortPostsByDate(filtered, sortDirection);
}

