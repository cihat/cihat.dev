"use client";

import BookmarkCard from "./bookmark-card";
import Container from "@/components/ui/container";
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
import { VList } from "virtua";

async function fetchData(collectionId: BookmarkType = BookmarkType.Technical) {
  const dateStartOfWeek = startOfWeek(subWeeks(new Date(), 6));
  // const date = format(dateStartOfWeek, "yyyy-MM-dd");

  const raindrop = new Raindrop();
  let collections: ILink[] = await raindrop.getBookmark({
    perPage: 100,
    // search: `created:>${date}`,
    collectionId,
  });

  // if (collections.length === 0) {
  //   collections = await raindrop.getBookmark({
  //     perPage: 50,
  //     collectionId,
  //   });
  // }

  const bookmarks = bookmarkGroupByWeekNumber(collections);

  return {
    data: bookmarks,
    year: format(dateStartOfWeek, "yyyy"),
  };
}

export default function BookmarkLayout() {
  const [data, setData] = useState([]);

  const sortedData = Object.keys(data).sort(
    (a, b) =>  parseInt(a) - parseInt(b)
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

      <VList style={{ height: 'calc(100vh - 212px)', marginTop: 16 }}>
        {sortedData.map((date) => (
          <div key={date} className="mt-8 left-animation">
            <SubTitle className="">{date}</SubTitle>
            <div className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
              {data[date].map((item: ILink) => {
                return <BookmarkCard key={item._id} bookmark={item} />;
              })}
            </div>
          </div>
        ))}
      </VList>

      {sortedData.length === 0 && (
        <div className="flex flex-col justify-center items-center mt-6">
          <Loading text="" />
        </div>
      )}
    </Container>
  );
}
