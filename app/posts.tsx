"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import useSWR from "swr";
import type { Post } from "@/types";

type SortSetting = ["date" | "views", "desc" | "asc"];
enum LangEnum {
  en = "en-US",
  tr = "tr-TR",
  all = "all"
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function Posts({ posts: initialPosts }) {
  const [sort, setSort] = useState<SortSetting>(["date", "desc"]);

  // const userLang: LangEnum = navigator.language || navigator?.userLanguage as any;

  const [lang, setLang] = useState<LangEnum>(LangEnum.all);
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
      <main className="left-animation text-sm no-scrollbar sm:h-70v overflow-y-scroll">
        <header className="text-gray-500 dark:text-gray-600 flex items-center text-sm py-1">
          <button
            onClick={sortDate}
            className={`${tabStyle} hover:bg-[#FF9B9B] w-12 h-9 text-left text-md font-semibold
              }`}
          >
            Date
            {sort[0] === "date" && sort[1] === "asc" && "↑"}
          </button>
          <span className={`grow pl-2 ${tabStyle}`}>Title</span>
          <button
            onClick={sortViews}
            className={`
              ${tabStyle}
              hover:bg-[#FFD6A5] h-9 text-md font-semibold
            `}
          >
            Views
            {sort[0] === "views" ? (sort[1] === "asc" ? "↑" : "↓") : ""}
          </button>

          <button
            onClick={handleEmoji}
            className={`
                  ${tabStyle}
                  hover:bg-[#FFFEC4]
                  flex
                  items-center
                  justify-center
                  h-9
                  text-md font-semibold
              }`}
          >
            Language: {flag}
          </button>
        </header>

        <List posts={posts} sort={sort} lang={lang} />
      </main>
    </Suspense>
  );
}

function List({ posts, sort, lang }: { posts: Post[], sort: SortSetting, lang: LangEnum }) {
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
    })
  }, [posts, sort, lang]);

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
                <span className={`py-3 flex grow items-center ${!firstOfYear ? "ml-14" : ""}`}>
                  {firstOfYear && (
                    <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">
                      {year}
                    </span>
                  )}

                  <span className="grow dark:text-gray-100">{post.title}</span>

                  <span className="text-gray-500 dark:text-gray-500 text-xs">
                    {post.viewsFormatted}
                  </span>
                </span>
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

const tabStyle = `p-2 rounded transition text-black dark:text-blue-500`

const getRandomBGColor = () => {
  const colorPalette = [
    '#FF9B9B',
    '#FFD6A5',
    '#FFFEC4',
    '#CBFFA9',
    '#9BF6FF',
    '#A0C4FF',
    '#BDB2FF',
    '#FFC6FF',
    '#AAC8A7',
    '#FFD8D8',
    '#FFD8A8',
    '#FFFFD8',
    '#D8FFD8',
    '#D8FFFF',
    '#D8D8FF',
  ]
  return colorPalette[Math.floor(Math.random() * colorPalette.length)]
}