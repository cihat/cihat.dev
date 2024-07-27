"use client";

import { useEffect, useState } from "react";
import { format, startOfWeek, subMonths, subWeeks } from "date-fns";

import BookmarkCard from "./bookmark-card";
import Container from "@/components/ui/container";
import SubTitle from "@/components/ui/subtitle";
import { ILink } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import { BookmarkType, DatePeriodType } from "@/store/types";
import Raindrop from "@/lib/raindrop";
import bookmarkGroupByWeekNumber from "@/lib/helper";
import { Loading } from "../loading";

const DatePeriodConfig = {
  [DatePeriodType.LAST_ONE_WEEK]: subWeeks(new Date(), 1),
  [DatePeriodType.LAST_TWO_WEEKS]: subWeeks(new Date(), 2),
  [DatePeriodType.LAST_ONE_MONTH]: subMonths(new Date(), 1),
};

async function fetchData(collectionId, subDateConfig) {
  const { type, dateStartOfWeek, subDate } = subDateConfig;

  const raindrop = new Raindrop();
  const searchQuery = type !== DatePeriodType.ALL_TIME ? `created:>${subDate}` : '-created';
  const collections = await raindrop.getBookmark({
    perPage: 50,
    search: searchQuery,
    collectionId,
  });

  return {
    data: bookmarkGroupByWeekNumber(collections),
    year: format(dateStartOfWeek, "yyyy"),
  };
}

function useBookmarks(initialTab, initialDateConfig) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [subDateState, setSubDateState] = useState(initialDateConfig);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const result = await fetchData(activeTab, subDateState);
        setData(result.data as unknown as never[])
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
    useStore.setState({ activeBookmarkType: activeTab });

    return () => {
      setData([]);
    };
  }, [activeTab, subDateState]);

  return { data, loading, activeTab, setActiveTab, subDateState, setSubDateState };
}

export default function BookmarkLayout() {
  const initialTab = BookmarkType.Technical;
  const initialDateConfig = {
    type: DatePeriodType.LAST_ONE_WEEK,
    dateStartOfWeek: startOfWeek(subWeeks(new Date(), 1)),
    subDate: format(startOfWeek(subWeeks(new Date(), 1)), 'yyyy-MM-dd'),
  };

  const { data, loading, activeTab, setActiveTab, subDateState, setSubDateState } = useBookmarks(initialTab, initialDateConfig);
  const sortedData = Object.keys(data);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleSubDateChange = (dateType) => {
    const dateStartOfWeek = startOfWeek(DatePeriodConfig[dateType] || new Date());
    const subDate = dateType !== DatePeriodType.ALL_TIME ? format(dateStartOfWeek, 'yyyy-MM-dd') : null;

    setSubDateState({ type: dateType, dateStartOfWeek, subDate });
  };

  return (
    <Container className="left-animation text-sm overflow-hidden">
      <Tabs defaultValue={BookmarkType.Technical} onValueChange={handleTabChange} className="w-[100%] flex flex-col justify-center items-center flex-wrap mb-2">
        <TabsList className="bg-[var(--primary-color)]">
          <TabsTrigger value={BookmarkType.Technical}>Technical</TabsTrigger>
          <TabsTrigger value={BookmarkType.DesignArtMusic}>Design & Art & Music</TabsTrigger>
          <TabsTrigger value={BookmarkType.Other}>Other</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs defaultValue={DatePeriodType.LAST_ONE_WEEK} onValueChange={handleSubDateChange} className="w-[100%] flex flex-col justify-center items-center flex-wrap text-sm">
        <TabsList className="bg-[var(--primary-color)]">
          <TabsTrigger value={DatePeriodType.LAST_ONE_WEEK}>Last 1 week</TabsTrigger>
          <TabsTrigger value={DatePeriodType.LAST_TWO_WEEKS}>Last 2 weeks</TabsTrigger>
          <TabsTrigger value={DatePeriodType.LAST_ONE_MONTH}>Last 1 month</TabsTrigger>
          <TabsTrigger value={DatePeriodType.ALL_TIME}>All</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading && <Loading className="m-4" />}
      {!loading && sortedData.length === 0 && <div className="text-center m-10 font-bold">No bookmarks found</div>}

      <div style={{ height: 'calc(100vh - 210px)', marginTop: 8, overflow: "scroll" }}>
        {sortedData.map((date) => (
          <div key={date} className="mt-4 left-animation">
            <SubTitle>{date}</SubTitle>
            <div className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
              {data[date].map((item) => (
                <BookmarkCard key={item._id} bookmark={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
