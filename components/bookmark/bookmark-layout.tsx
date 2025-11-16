"use client";

import { useState } from "react";
import { addDays, format, startOfWeek, subMonths, subWeeks, parse, startOfMonth, endOfMonth } from "date-fns";
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

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customStartMonth, setCustomStartMonth] = useState("");
  const [customEndMonth, setCustomEndMonth] = useState("");

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

    const newDateRange = {
      from: start,
      to: dateType !== DatePeriodType.ALL_TIME ? end : null
    };
    setDateRange(newDateRange);

    // Sync custom inputs
    if (start) {
      setCustomStartDate(format(start, "yyyy-MM-dd"));
      setCustomStartMonth(format(start, "yyyy-MM"));
    } else {
      setCustomStartDate("");
      setCustomStartMonth("");
    }
    if (dateType !== DatePeriodType.ALL_TIME && end) {
      setCustomEndDate(format(end, "yyyy-MM-dd"));
      setCustomEndMonth(format(end, "yyyy-MM"));
    } else {
      setCustomEndDate("");
      setCustomEndMonth("");
    }
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

  const handleCustomDateSubmit = () => {
    let start: Date | null = null;
    let end: Date | null = null;

    // Handle custom start date
    if (customStartDate) {
      try {
        start = parse(customStartDate, "yyyy-MM-dd", new Date());
      } catch (e) {
        console.error("Invalid start date format");
      }
    } else if (customStartMonth) {
      try {
        const monthDate = parse(customStartMonth, "yyyy-MM", new Date());
        start = startOfMonth(monthDate);
      } catch (e) {
        console.error("Invalid start month format");
      }
    }

    // Handle custom end date
    if (customEndDate) {
      try {
        end = parse(customEndDate, "yyyy-MM-dd", new Date());
      } catch (e) {
        console.error("Invalid end date format");
      }
    } else if (customEndMonth) {
      try {
        const monthDate = parse(customEndMonth, "yyyy-MM", new Date());
        end = endOfMonth(monthDate);
      } catch (e) {
        console.error("Invalid end month format");
      }
    }

    if (start && end) {
      const startDate = startOfWeek(start);
      setDateRange({ from: start, to: end });
      setTimeRange({
        type: "custom",
        dateStartOfWeek: startDate,
        subDate: format(startDate, "yyyy-MM-dd"),
        start,
        end
      });
    } else if (start) {
      setDateRange({ from: start, to: null });
    } else if (end) {
      setDateRange({ from: null, to: end });
    }
  };

  // Sync custom inputs when dateRange changes from calendar
  const handleDateRangeChangeWithSync = (range) => {
    handleDateRangeChange(range);
    if (range.from) {
      setCustomStartDate(format(range.from, "yyyy-MM-dd"));
      setCustomStartMonth(format(range.from, "yyyy-MM"));
    }
    if (range.to) {
      setCustomEndDate(format(range.to, "yyyy-MM-dd"));
      setCustomEndMonth(format(range.to, "yyyy-MM"));
    }
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
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:border-r border-b sm:border-b-0">
                    <CalendarComponent
                      mode="range"
                      selected={dateRange}
                      onSelect={handleDateRangeChangeWithSync}
                      initialFocus
                    />
                  </div>
                  <div className="p-4 min-w-[280px] border-t sm:border-t-0 sm:border-l">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => {
                            setCustomStartDate(e.target.value);
                            if (e.target.value) setCustomStartMonth("");
                          }}
                          placeholder="YYYY-MM-DD"
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-center">or</div>
                        <Input
                          type="month"
                          value={customStartMonth}
                          onChange={(e) => {
                            setCustomStartMonth(e.target.value);
                            if (e.target.value) setCustomStartDate("");
                          }}
                          placeholder="YYYY-MM"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => {
                            setCustomEndDate(e.target.value);
                            if (e.target.value) setCustomEndMonth("");
                          }}
                          placeholder="YYYY-MM-DD"
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-center">or</div>
                        <Input
                          type="month"
                          value={customEndMonth}
                          onChange={(e) => {
                            setCustomEndMonth(e.target.value);
                            if (e.target.value) setCustomEndDate("");
                          }}
                          placeholder="YYYY-MM"
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={handleCustomDateSubmit}
                        className="w-full"
                        size="sm"
                      >
                        Apply Custom Date
                      </Button>
                    </div>
                  </div>
                </div>
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
