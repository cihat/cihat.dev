"use client";

import { addDays, format, startOfWeek, subMonths, subWeeks } from "date-fns";
import { Search, Calendar } from "lucide-react";

import BookmarkCard from "./bookmark-card";
import Container from "@/components/ui/container";
import SubTitle from "@/components/ui/subtitle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { BookmarkType, DatePeriodType } from "@/store/types";
import { Loading } from "../loading";
import { useBookmarks } from "@/app/hooks/useBookmarks";
import "./style.css";

const DatePeriodConfig = {
  [DatePeriodType.LAST_ONE_WEEK]: subWeeks(new Date(), 1),
  [DatePeriodType.LAST_TWO_WEEKS]: subWeeks(new Date(), 2),
  [DatePeriodType.LAST_ONE_MONTH]: subMonths(new Date(), 1),
};

export default function BookmarkLayout() {
  const initialTab = BookmarkType.Technical;
  const initialTimeRange = {
    type: DatePeriodType.LAST_ONE_WEEK,
    dateStartOfWeek: startOfWeek(subWeeks(new Date(), 1)),
    subDate: format(startOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd"),
    start: subWeeks(new Date(), 1),
    //! Fix better this bug, i add one day for hot fix but it's not the best solution
    end: addDays(new Date(), 1)
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
    <Container className="left-animation text-sm overflow-hidden w-full">
      <div className="flex flex-col space-y-3 w-full mb-4">
        <Tabs
          defaultValue={BookmarkType.Technical}
          onValueChange={handleTabChange}
          className="w-full flex flex-col justify-center items-center"
        >
          <TabsList className="bg-[var(--primary-color)]">
            <TabsTrigger className="cursor-pointer" value={BookmarkType.Technical}>Technical</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value={BookmarkType.DesignArtMusic}>Design & Art & Music</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value={BookmarkType.Other}>Other</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row w-full gap-2">
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
              {loading && searchQuery && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                </div>
              )}
            </div>
          </form>

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

      {/* <div style={{ height: "calc(100vh - 236px)", marginTop: 8, overflow: "auto" }}> */}
      <div className="sortedDataWrapper">
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
