import { format, parseISO } from "date-fns";
import { ILink } from "@/types";

const bookmarkGroupByWeekNumber = (data) => {
  return Object.groupBy(data, (bookmark: ILink) =>
    format(parseISO(bookmark.created), "d MMM yyyy")
  );
};

export default bookmarkGroupByWeekNumber;
