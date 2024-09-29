import { format, parseISO } from "date-fns";
import { ILink } from "@/types";

const groupBy = <T>(array: T[], keyGetter: (item: T) => string) => {
  const grouped: { [key: string]: T[] } = {};

  array.forEach((item) => {
    const key = keyGetter(item);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

const bookmarkGroupByWeekNumber = (data: ILink[]) => {
  return groupBy(data, (bookmark: ILink) => format(parseISO(bookmark.created), "d MMM yyyy"));
};

export default bookmarkGroupByWeekNumber;
