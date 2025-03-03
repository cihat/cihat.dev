import Raindrop from "@/lib/raindrop";
import { ILink } from "@/types";
import { format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { DatePeriodType } from "@/store/types";
import bookmarkGroupByWeekNumber from "@/lib/helper";
import { useDebounce } from "./useDebounce";

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

export function useBookmarks(initialTab, initialTimeRange) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState({
    from: subWeeks(new Date(), 1),
    to: new Date()
  });

  // Use debounced search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchInput, 500);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const result = await fetchData(activeTab, {
          timeRange,
          searchQuery: debouncedSearchQuery
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
  }, [activeTab, timeRange, debouncedSearchQuery]);

  return {
    data,
    loading,
    activeTab,
    setActiveTab,
    timeRange,
    setTimeRange,
    searchQuery: searchInput,
    setSearchQuery: setSearchInput,
    dateRange,
    setDateRange
  };
}
