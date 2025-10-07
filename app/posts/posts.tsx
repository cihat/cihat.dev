"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/types";
import Category from "./category";
import { CategoryEnum, LangEnum } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Fuse from "fuse.js";
import { getYear } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type SortSetting = ["date" | "views", "desc" | "asc"];

export function Posts({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();

  const [sort, setSort] = useState<SortSetting>(["date", "desc"]);
  const [lang, setLang] = useState<LangEnum>(LangEnum.all);
  const [category, setCategory] = useState<CategoryEnum>((searchParams.get("category") as CategoryEnum) || CategoryEnum.all);
  const [flag, setFlag] = useState("🇹🇷🇬🇧");
  const [input, setInput] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  // Create Fuse instance for search
  const [fuse] = useState(() => new Fuse(posts, { 
    keys: ["title", "category"], 
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2
  }));

  const sortDate = useCallback(() => {
    setSort((sort) => ["date", sort[0] !== "date" || sort[1] === "asc" ? "desc" : "asc"]);
  }, []);


  const handleEmoji = useCallback(() => {
    switch (lang) {
      case LangEnum.en: {
        setFlag("🇹🇷🇬🇧");
        setLang(LangEnum.all);
        break;
      }
      case LangEnum.tr: {
        setFlag("🇬🇧");
        setLang(LangEnum.en);
        break;
      }
      case LangEnum.all: {
        setFlag("🇹🇷");
        setLang(LangEnum.tr);
        break;
      }
    }
  }, [lang]);

  // Search effect
  useEffect(() => {
    if (input.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const results = fuse.search(input.trim()).map((result) => result.item as Post);
      setFilteredPosts(results);
    }
  }, [input, posts, fuse]);

  return (
    <div className="left-animation text-sm no-scrollbar grow overflow-y-scroll h-full">
      <header className="flex items-center text-sm sticky top-0 p-1 rounded-md bg-white dark:bg-black">
        <Button variant="outline" size="sm" onClick={sortDate} className="w-13 h-9 text-left text-md font-semibold">
          Date
          {sort[0] === "date" && sort[1] === "asc" && "↑"}
        </Button>
        <div className="grow pl-2">
          <Input 
            type="text" 
            placeholder="Search posts..." 
            className="w-full" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
          />
        </div>
        <Category category={category} setCategory={setCategory} />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEmoji} 
          className="flex items-center justify-center h-9 text-md font-semibold w-16 mr-2"
        >
          {flag}
        </Button>
      </header>

      <List posts={filteredPosts} sort={sort} lang={lang} category={category} />
    </div>
  );
}

function List({ posts, sort, lang, category }: { posts: Post[]; sort: SortSetting; lang: LangEnum; category: CategoryEnum }) {
  // sort can be ["date", "desc"] or ["views", "desc"] for example
  const sortedPosts = useMemo(() => {
    const [sortKey, sortDirection] = sort;
    return [...posts]
      .sort((a, b) => {
        // Sort by date only
        return sortDirection === "desc" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .filter((post) => {
        if (lang === LangEnum.all) return post;
        if (post.language === lang) return post;
      })
      .filter((post) => {
        if (category === CategoryEnum.all) return post;
        if (post.category.toLowerCase() === category.toLowerCase()) return post;
      });
  }, [posts, sort, lang, category]);

  if (!sortedPosts.length) return <p className="flex justify-center items-center text-center text-xl mt-12 font-semibold">Not found</p>;

  return (
    <ul>
      {sortedPosts.map((post, i: number) => {
        const year = getYear(post.date);
        const firstOfYear = !sortedPosts[i - 1] || getYear(sortedPosts[i - 1].date) !== year;
        const lastOfYear = !sortedPosts[i + 1] || getYear(sortedPosts[i + 1].date) !== year;

        return (
          <li key={post.id}>
            <Link href={`/${new Date(post.date).getFullYear()}/${post.path}`} title={`Read ${post.title} - ${post.minuteToRead} minute read`}>
              <span
                className={`flex px-2  transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
                ${!firstOfYear ? "border-t-0" : ""}
                ${lastOfYear ? "border-b-0" : ""}
              `}
              >
                <div className={`py-2 flex grow items-center justify-between ${!firstOfYear ? "ml-14" : ""}`}>
                  {firstOfYear && <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">{year}</span>}
                  <div className="flex flex-col grow">
                    <div>
                      <span className="grow dark:text-gray-100 font-semibold">{post.title}</span>
                      &nbsp;|&nbsp;
                      <span className="text-xs text-gray-500 dark:text-gray-500">{post.minuteToRead} mins</span>
                    </div>
                    <div>
                      <Badge className="mr-2">{post.category}</Badge>
                      <span className="text-xs">{post.date}</span>
                    </div>
                  </div>

                </div>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
