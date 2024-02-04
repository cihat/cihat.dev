"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import useSWR from "swr";
import type { Post } from "@/types";
import Category from "./category";
import { CategoryEnum, LangEnum } from "@/types";
import { Badge } from "@/components/ui/badge";

type SortSetting = ["date" | "views", "desc" | "asc"];


const fetcher = (url: string) => fetch(url).then(res => res.json());

export function Posts({ posts: initialPosts }) {
  const [sort, setSort] = useState<SortSetting>(["date", "desc"]);
  const [lang, setLang] = useState<LangEnum>(LangEnum.all);
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.all);
  const [flag, setFlag] = useState("🇹🇷🇬🇧")

  const { data: posts } = useSWR("/api/posts", fetcher, {
    fallbackData: initialPosts,
    refreshInterval: 5000,
  });

  function sortDate() {
    setSort(sort => [
      "date",
      sort[0] !== "date" || sort[1] === "asc" ? "desc" : "asc",
    ]);
  }

  function sortViews() {
    setSort(sort => [
      sort[0] === "views" && sort[1] === "asc" ? "date" : "views",
      sort[0] !== "views" ? "desc" : sort[1] === "asc" ? "desc" : "asc",
    ]);
  }

  function handleEmoji() {
    switch (lang) {
      case LangEnum.en: {
        setFlag("🇹🇷🇬🇧")
        setLang(LangEnum.all)
        break;
      }
      case LangEnum.tr: {
        setFlag("🇬🇧")
        setLang(LangEnum.en)
        break;
      }
      case LangEnum.all: {
        setFlag("🇹🇷")
        setLang(LangEnum.tr)
        break;
      }
    }
  }

  return (
    <Suspense fallback={null}>
      <div className="left-animation text-sm no-scrollbar grow overflow-y-scroll">
        <header className="text-gray-500 dark:text-gray-600 flex items-center text-sm py-1 sticky top-0">
          <button
            onClick={sortDate}
            className={`${tabStyle} 
            ${sort[0] === "date" && 'bg-[#eceece] dark:bg-[#2a2a2a]'} w-13 h-9 text-left text-md font-semibold mr-2`}
          >
            Date
            {sort[0] === "date" && sort[1] === "asc" && "↑"}
          </button>
          <span className={`grow pl-2 bg-[#f2f2f2] dark:bg-[#1C1C1C] ${tabStyle}`}>Title</span>
          <Category category={category} setCategory={setCategory} />
          <button
            onClick={handleEmoji}
            className={`
                bg-[#f2f2f2] dark:bg-[#1C1C1C]
                  ${tabStyle}
                  hover:bg-[#FFFEC4]
                  hover:dark:bg-[#2a2a2a]
                  flex
                  items-center
                  justify-center
                  h-9
                  text-md font-semibold
                  w-16
                  mr-2
              }`}
          >{flag}</button>
          <button
            onClick={sortViews}
            className={`
              bg-[#f2f2f2] dark:bg-[#1C1C1C]
              ${tabStyle}
              ${sort[0] === "views" && 'bg-[#FFD6A5] dark:bg-[#2a2a2a]'} h-9 text-md font-semibold
            `}
          >
            Views
            {sort[0] === "views" ? (sort[1] === "asc" ? "↑" : "↓") : ""}
          </button>
        </header>

        <List posts={posts} sort={sort} lang={lang} category={category} />
      </div>
    </Suspense>
  );
}

function List({ posts, sort, lang, category }: { posts: Post[], sort: SortSetting, lang: LangEnum, category: CategoryEnum }) {
  // sort can be ["date", "desc"] or ["views", "desc"] for example
  const sortedPosts = useMemo(() => {
    const [sortKey, sortDirection] = sort;
    return [...posts].sort((a, b) => {
      if (sortKey === "date") {
        return sortDirection === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sortDirection === "desc" ? b.views - a.views : a.views - b.views;
      }
    }).filter(post => {
      if (lang === LangEnum.all) return post
      if (post.language === lang) return post
    }).filter(post => {
      if (category === CategoryEnum.all) return post
      if (post.category.toLocaleLowerCase() === category.toLocaleLowerCase()) return post
    });

  }, [posts, sort, lang, category]);

  if (!sortedPosts.length) return (
    <p className="flex justify-center items-center text-center  text-md mt-5">Coming soon</p>
  )

  return (
    <ul>
      {sortedPosts.map((post, i: number) => {
        const year = getYear(post.date);
        const firstOfYear =
          !sortedPosts[i - 1] || getYear(sortedPosts[i - 1].date) !== year;
        const lastOfYear =
          !sortedPosts[i + 1] || getYear(sortedPosts[i + 1].date) !== year;

        return (
          <li key={post.id}>
            <Link href={`/${new Date(post.date).getFullYear()}/${post.id}`}>
              <span
                className={`flex px-2  transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
                ${!firstOfYear ? "border-t-0" : ""}
                ${lastOfYear ? "border-b-0" : ""}
              `}
              >
                <div className={`py-2 flex grow items-center justify-between ${!firstOfYear ? "ml-14" : ""}`}>
                  {firstOfYear && (
                    <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">
                      {year}
                    </span>
                  )}
                  <div className="flex flex-col grow">
                    <div>
                      <span className="grow dark:text-gray-100 font-semibold">
                        {post.title}
                      </span>
                      &nbsp;|&nbsp;
                      <span className="text-xs text-gray-500 dark:text-gray-500">{post.minuteToRead} mins</span>
                    </div>
                    <div>
                      <Badge className="mr-2">
                        {post.category}
                      </Badge>
                      <span className="text-xs">
                        {post.date}
                      </span>
                    </div>
                  </div>

                  <span className="text-gray-500 dark:text-gray-500 text-xs">
                    {post.viewsFormatted}
                  </span>
                </div>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function getYear(date: string) {
  return new Date(date).getFullYear();
}

const tabStyle = `p-2 rounded transition text-black dark:text-gray-100 border-[1px] border-gray-200 dark:border-[#313131] border-gray-300 dark:border-[#4a4a4a]`
