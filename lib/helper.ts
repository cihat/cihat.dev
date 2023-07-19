import { format, parseISO } from "date-fns";
import { groupBy } from "lodash";
import { ILink } from "@/types";

const bookmarkGroupByWeekNumber = (data) => {
  return groupBy(data, (bookmark: ILink) =>
    format(parseISO(bookmark.created), "d MMM yyyy")
  );
};

export default bookmarkGroupByWeekNumber;
