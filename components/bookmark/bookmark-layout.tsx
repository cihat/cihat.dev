"use client";

import BookmarkCard from "./bookmark-card";
import Container from "@/components/ui/container";
import Title from "@/components/ui/title";
import SubTitle from "@/components/ui/subtitle";
import { ILink } from "@/types";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { BookmarkType } from "@/store/types";

import { format, startOfWeek, subWeeks } from "date-fns";
import Raindrop from "@/lib/raindrop";
import bookmarkGroupByWeekNumber from "@/lib/helper";
import { Loading } from "../loading";

async function fetchData(collectionId: BookmarkType = BookmarkType.Technical) {
  const dateStartOfWeek = startOfWeek(subWeeks(new Date(), 1));
  const date = format(dateStartOfWeek, "yyyy-MM-dd");

  const raindrop = new Raindrop();
  const collections: ILink[] = await raindrop.getBookmark({
    perPage: 100,
    search: `created:>${date}`,
    collectionId,
  });
  const data = bookmarkGroupByWeekNumber(collections);

  return {
    data,
    year: format(dateStartOfWeek, "yyyy"),
  };
}

export default function BookmarkLayout() {
  const [data, setData] = useState([]);

  console.log('data', data)
  const sortedData = Object.keys(data).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );
  const [activeTab, setActiveTab] = useState<BookmarkType>(BookmarkType.Technical);

  const handleTabChange = (value) => {
    switch (value) {
      case BookmarkType.Technical:
        setActiveTab(BookmarkType.Technical);
        break;
      case BookmarkType.DesignArtMusic:
        setActiveTab(BookmarkType.DesignArtMusic);
        break;
      case BookmarkType.Other:
        setActiveTab(BookmarkType.Other);
        break;
    }
  }

  useEffect(() => {
    (async () => {
      setData((await fetchData(activeTab)).data as any);
    })();
    useStore.setState({ activeBookmarkType: activeTab });

    return () => {
      setData([]);
    }
  }, [activeTab])

  return (
    <Container className="min-h-[80vh] left-animation">
      <Tabs defaultValue={BookmarkType.Technical} onValueChange={handleTabChange} className="w-[100%] flex flex-col justify-center items-center flex-wrap">
        <TabsList className="bg-[var(--primary-color)]">
          <TabsTrigger value={BookmarkType.Technical}>Technical</TabsTrigger>
          <TabsTrigger value={BookmarkType.DesignArtMusic}>Design & Art & Music</TabsTrigger>
          <TabsTrigger value={BookmarkType.Other}>Other</TabsTrigger>
        </TabsList>
      </Tabs>

      {sortedData.map((date) => (
        <div key={date} className="mt-20 left-animation">
          <SubTitle className="">{date}</SubTitle>
          <div className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
            {data[date].map((item: ILink) => {
              return <BookmarkCard key={item._id} bookmark={item} />;
            })}
          </div>
        </div>
      ))}

      {sortedData.length === 0 && (
        <div className="flex flex-col justify-center items-center mt-6">
          <Loading text="" />
        </div>
      )}
    </Container>
  );
}
