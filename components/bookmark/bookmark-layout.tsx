"use client";

import { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, subMonths, subWeeks, isBefore } from "date-fns";
import { Search, Calendar } from "lucide-react";

import BookmarkCard from "./bookmark-card";
import Container from "@/components/ui/container";
import SubTitle from "@/components/ui/subtitle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useStore } from "@/store";
import { BookmarkType, DatePeriodType } from "@/store/types";
import Raindrop from "@/lib/raindrop";
import bookmarkGroupByWeekNumber from "@/lib/helper";
import { Loading } from "../loading";
import { ILink } from "@/types";

const DatePeriodConfig = {
  [DatePeriodType.LAST_ONE_WEEK]: subWeeks(new Date(), 1),
  [DatePeriodType.LAST_TWO_WEEKS]: subWeeks(new Date(), 2),
  [DatePeriodType.LAST_ONE_MONTH]: subMonths(new Date(), 1),
};

async function fetchData(collectionId, config) {
  const { timeRange, searchQuery } = config;

  const raindrop = new Raindrop();
  let searchParam = searchQuery ? searchQuery : "";

  // Add date filter to search if a time range is specified
  if (timeRange.start && timeRange.end) {
    const startDate = format(timeRange.start, "yyyy-MM-dd");
    const endDate = format(timeRange.end, "yyyy-MM-dd");
    searchParam += searchParam ? ` created:>${startDate} created:<${endDate}` : `created:>${startDate} created:<${endDate}`;
  } else if (timeRange.type && timeRange.type !== DatePeriodType.ALL_TIME) {
    searchParam += searchParam ? ` created:>${timeRange.subDate}` : `created:>${timeRange.subDate}`;
  }

  // If no search or time range, use default
  if (!searchParam) {
    searchParam = "-created";
  }

  const collections = await raindrop.getBookmark({
    perPage: 50,
    search: searchParam,
    collectionId,
  });

  return {
    data: bookmarkGroupByWeekNumber(collections),
    year: timeRange.start ? format(timeRange.start, "yyyy") : format(new Date(), "yyyy"),
  };
}

function useBookmarks(initialTab, initialTimeRange) {
  const [data, setData] = useState<{ [key: string]: ILink[] }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: subWeeks(new Date(), 1),
    to: new Date()
  });

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const result = await fetchData(activeTab, {
          timeRange,
          searchQuery
        });
        setData(result.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
    useStore.setState({ activeBookmarkType: activeTab });

    return () => {
      setData({});
    };
  }, [activeTab, timeRange, searchQuery]);

  return {
    data,
    loading,
    activeTab,
    setActiveTab,
    timeRange,
    setTimeRange,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange
  };
}

export default function BookmarkLayout() {
  const initialTab = BookmarkType.Technical;
  const initialTimeRange = {
    type: DatePeriodType.LAST_ONE_WEEK,
    dateStartOfWeek: startOfWeek(subWeeks(new Date(), 1)),
    subDate: format(startOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd"),
    start: subWeeks(new Date(), 1),
    end: new Date()
  };

  const {
    data,
    loading,
    activeTab,
    setActiveTab,
    timeRange,
    setTimeRange,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange
  } = useBookmarks(initialTab, initialTimeRange);

  const sortedData = Object.keys(data);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handlePresetPeriodChange = (dateType) => {
    const dateStartOfWeek = startOfWeek(DatePeriodConfig[dateType] || new Date());
    const subDate = dateType !== DatePeriodType.ALL_TIME ? format(dateStartOfWeek, "yyyy-MM-dd") : null;
    const start = dateType !== DatePeriodType.ALL_TIME ? DatePeriodConfig[dateType] : null;
    const end = new Date();

    setTimeRange({
      type: dateType,
      dateStartOfWeek,
      subDate,
      start,
      end: dateType !== DatePeriodType.ALL_TIME ? end : null
    });

    setDateRange({
      from: start,
      to: end
    });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);

    // Only update if we have both dates
    if (range.from && range.to) {
      const startDate = startOfWeek(range.from);

      setTimeRange({
        type: "custom",
        dateStartOfWeek: startDate,
        subDate: format(startDate, "yyyy-MM-dd"),
        start: range.from,
        end: range.to
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the effect hook monitoring searchQuery
  };

  const formatDateRange = () => {
    if (timeRange.type === DatePeriodType.ALL_TIME) {
      return "All Time";
    }

    if (timeRange.type === "custom" && timeRange.start && timeRange.end) {
      return `${format(timeRange.start, "MMM d, yyyy")} - ${format(timeRange.end, "MMM d, yyyy")}`;
    }

    return {
      [DatePeriodType.LAST_ONE_WEEK]: "Last Week",
      [DatePeriodType.LAST_TWO_WEEKS]: "Last 2 Weeks",
      [DatePeriodType.LAST_ONE_MONTH]: "Last Month"
    }[timeRange.type] || "Custom Range";
  };

  return (
    <Container className="left-animation text-sm overflow-hidden">
      <div className="flex flex-col space-y-3 w-full mb-4">
        {/* Category Tabs */}
        <Tabs
          defaultValue={BookmarkType.Technical}
          onValueChange={handleTabChange}
          className="w-full flex flex-col justify-center items-center"
        >
          <TabsList className="bg-[var(--primary-color)]">
            <TabsTrigger value={BookmarkType.Technical}>Technical</TabsTrigger>
            <TabsTrigger value={BookmarkType.DesignArtMusic}>Design & Art & Music</TabsTrigger>
            <TabsTrigger value={BookmarkType.Other}>Other</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Date Range UI */}
        <div className="flex flex-col sm:flex-row w-full gap-2">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </form>

          {/* Date Range Selector */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center whitespace-nowrap">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-2 border-b">
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetPeriodChange(DatePeriodType.LAST_ONE_WEEK)}
                    >
                      Last Week
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetPeriodChange(DatePeriodType.LAST_TWO_WEEKS)}
                    >
                      Last 2 Weeks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetPeriodChange(DatePeriodType.LAST_ONE_MONTH)}
                    >
                      Last Month
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetPeriodChange(DatePeriodType.ALL_TIME)}
                    >
                      All Time
                    </Button>
                  </div>
                </div>
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {loading && <Loading className="m-4" />}
      {!loading && sortedData.length === 0 && (
        <div className="text-center m-10 font-bold">No bookmarks found</div>
      )}

      <div style={{ height: "calc(100vh - 280px)", marginTop: 8, overflow: "auto" }}>
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
