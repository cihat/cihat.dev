import BookmarkLayout from "@/components/bookmark/bookmark-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: ""
};

export const revalidate = 3600; // 60*60 1 hours

export default async function Bookmark() {
  return (
    <BookmarkLayout />
  );
}
