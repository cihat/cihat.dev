import Link from "@/components/ui/link";
import { parseISO, formatDistanceToNowStrict } from "date-fns";
import { tr } from "date-fns/locale";
import { ILink } from "@/types";
import Image from "next/image";
import Container from "../ui/container";

function BookmarkCard({ bookmark }: { bookmark: ILink }) {
  console.log(bookmark, 'bookmark')
  return (
    <Container className="flex justify-start mb-2 py-2">
      <Link href={bookmark.link} className="flex-shrink-0 project-card">
        <Image src={bookmark.cover} alt={bookmark.title} width={300} height={300} className="rounded" />
      </Link>
      <article className="ml-6">
        <h3 className="shine font-semibold">
          <Link href={bookmark.link}>{bookmark.title}</Link>
        </h3>
        <div className="mt-1 flex items-center space-x-2">
          <span>{bookmark.domain}</span>
          <span>•</span>
          <span>
            {formatDistanceToNowStrict(parseISO(bookmark.created), {
              addSuffix: true,
              locale: tr,
            })}
          </span>
        </div>
      </article>
    </Container>
  );
}

export default BookmarkCard;
