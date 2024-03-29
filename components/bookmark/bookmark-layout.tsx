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
import { BookmarkType, DatePeriodType } from "@/store/types";

import { format, startOfWeek, subMonths, subWeeks, subYears } from "date-fns";
import Raindrop from "@/lib/raindrop";
import bookmarkGroupByWeekNumber from "@/lib/helper";
import { Loading } from "../loading";

async function fetchData(collectionId: BookmarkType = BookmarkType.Technical, subDateConfig) {
  const { type, dateStartOfWeek, subDate } = subDateConfig;

  const raindrop = new Raindrop();
  let collections: ILink[] = await raindrop.getBookmark({
    perPage: 50,
    search: type !== DatePeriodType.ALL_TIME ? `created:>${subDate}` : '-created',
    collectionId,
  })

  const bookmarks = bookmarkGroupByWeekNumber(collections);

  return {
    data: bookmarks,
    year: format(dateStartOfWeek, "yyyy"),
  };
}

type DatePeriod = {
  type: DatePeriodType,
  dateStartOfWeek: any,
  subDate: any
}


export default function BookmarkLayout() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortedData = Object.keys(data);
  const [activeTab, setActiveTab] = useState<BookmarkType>(BookmarkType.Technical);
  const [subDateState, setSubDateState] = useState<DatePeriod>({
    type: DatePeriodType.LAST_ONE_WEEK,
    dateStartOfWeek: startOfWeek(subWeeks(new Date(), 1)),
    subDate: format(startOfWeek(subWeeks(new Date(), 1)), 'yyyy-MM-dd')
  });

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

  const handleSubDateChange = (dateType) => {
    let dateStartOfWeek;
    let subDate

    switch (dateType) {
      case DatePeriodType.LAST_ONE_WEEK:
        dateStartOfWeek = startOfWeek(subWeeks(new Date(), 1));
        subDate = format(dateStartOfWeek, 'yyyy-MM-dd')

        setSubDateState({
          type: DatePeriodType.LAST_ONE_WEEK,
          dateStartOfWeek,
          subDate
        })
        break;
      case DatePeriodType.LAST_TWO_WEEKS:
        dateStartOfWeek = startOfWeek(subWeeks(new Date(), 2));
        subDate = format(dateStartOfWeek, 'yyyy-MM-dd')

        setSubDateState({
          type: DatePeriodType.LAST_TWO_WEEKS,
          dateStartOfWeek,
          subDate
        })
        break;
      case DatePeriodType.LAST_ONE_MONTH:
        dateStartOfWeek = startOfWeek(subMonths(new Date(), 1));
        subDate = format(dateStartOfWeek, 'yyyy-MM-dd')

        setSubDateState({
          type: DatePeriodType.LAST_ONE_MONTH,
          dateStartOfWeek,
          subDate
        })
        break;
      default:
        setSubDateState({
          type: DatePeriodType.ALL_TIME,
          dateStartOfWeek: startOfWeek(new Date()),
          subDate: null
        })
        break;
    }
  }

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const result = await fetchData(activeTab, subDateState);
        setData(result.data as unknown as never[]);
      } finally {
        setLoading(false); // Set loading to false after data is fetched (or an error occurs)
      }
    };

    fetchDataAsync();

    useStore.setState({ activeBookmarkType: activeTab });

    return () => {
      setData([]);
    };
  }, [activeTab, subDateState]);

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
      {!loading && sortedData.length === 0 && <div className="text-center m-4">No bookmarks found</div>}

      <div style={{ height: 'calc(100vh - 210px)', marginTop: 8, overflow: "scroll" }}>
        {sortedData.map((date) => (
          <div key={date} className="mt-4 left-animation">
            <SubTitle className="">{date}</SubTitle>
            <div className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
              {data[date].map((item: ILink) => {
                return <BookmarkCard key={item._id} bookmark={item} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
