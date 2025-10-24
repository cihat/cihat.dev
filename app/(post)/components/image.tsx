import { Caption } from "./caption";
import NextImage from "next/image";
import cx from "@/lib/cx";

export async function Image({
  src,
  alt: originalAlt,
  width = null,
  height = null,
  inline = false,
}: {
  src: string;
  alt?: string;
  width: number | null;
  height: number | null;
  inline?: boolean;
}) {
  const isDataImage = src.startsWith("data:");
  if (isDataImage) {
    /* eslint-disable @next/next/no-img-element */
    return <img src={src} alt={originalAlt ?? ""} />;
  } else {
    // Skip server-side image processing on Cloudflare Workers to reduce CPU usage
    if (width === null || height === null) {
      // Use default dimensions to avoid CPU-intensive image processing
      width = width || 800;
      height = height || 600;
    }
    
    let alt: string | null = null;
    let dividedBy = 100;
    if ("string" === typeof originalAlt) {
      const match = originalAlt.match(/(.*) (\[(\d+)%\])?$/);
      if (match != null) {
        alt = match[1];
        dividedBy = match[3] ? parseInt(match[3]) : 100;
      }
    } else {
      alt = originalAlt ?? null;
    }
    const factor = dividedBy / 100;
    return (
      <span className={cx("my-5 flex flex-col items-center", inline && "inline mr-2")}>
        <NextImage
          width={width * factor}
          height={height * factor}
          alt={alt ?? ""}
          title={alt ?? "Blog post image"}
          src={src}
          className="delay-500 z-[10] xl:hover:scale-[1.2] 2xl:hover:scale-[1.3] transition"
          loading="lazy"
        />
        {originalAlt && <Caption>{originalAlt}</Caption>}
      </span>
    );
  }
}
