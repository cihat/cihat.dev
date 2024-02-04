import Link from "@/components/ui/link";
import { parseISO, formatDistanceToNowStrict } from "date-fns";
import { tr } from "date-fns/locale";
import { ILink } from "@/types";
import Image from "next/image";
import Container from "../ui/container";
import defaultImage from "@/public/placeholder-image.png";
import { useState } from "react";

function BookmarkCard({ bookmark }: { bookmark: ILink }) {
  const [imgSrc, setImgSrc] = useState(bookmark.cover);

  return (
    <Container className="flex flex-col md:flex-row justify-center items-start md:justify-start mb-2 py-2">
      <Link href={bookmark.link} className="flex-shrink-0 project-card">
        <Image
          onError={() => setImgSrc(defaultImage.src)}
          src={imgSrc || "/"}
          alt={bookmark.title}
          placeholder="blur"
          blurDataURL="/"
          width={300}
          height={300}
          className="rounded h-auto"
        />
      </Link>
      <article className="ml-0 mt-2 md:mt-0 md:ml-6">
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
        {
          bookmark.excerpt && (
            <h4 className="cut_text">
              {
                bookmark.excerpt.length > 200
                  ? `${bookmark.excerpt.slice(0, 200)}...`
                  : bookmark.excerpt
              }
            </h4>
          )
        }
      </article>
    </Container>
  );
}

export default BookmarkCard;
