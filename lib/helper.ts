import { format, parseISO } from "date-fns";
import { ILink } from "@/types";

//https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const bookmarkGroupByWeekNumber = (data) => {
  return groupBy(data, (bookmark: ILink) =>
    format(parseISO(bookmark.created), "d MMM yyyy")
  );
};

export default bookmarkGroupByWeekNumber;
