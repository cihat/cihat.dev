import sizeOf from "image-size";
import { join } from "path";
import { readFile } from "fs/promises";
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
    if (width === null || height === null) {
      let imageBuffer: Buffer | null = null;
      if (src.startsWith("http")) {
        // Fix: Convert ArrayBuffer to Uint8Array before creating Buffer
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(new Uint8Array(arrayBuffer));
      } else {
        if (!process.env.CI && process.env.NODE_ENV === "production") {
          // Fix: Convert ArrayBuffer to Uint8Array before creating Buffer
          const response = await fetch("https://" + process.env.VERCEL_URL + src);
          const arrayBuffer = await response.arrayBuffer();
          imageBuffer = Buffer.from(new Uint8Array(arrayBuffer));
        } else {
          imageBuffer = await readFile(
            new URL(
              join(import.meta.url, "..", "..", "..", "..", "public", src)
            ).pathname
          );
        }
      }
      const computedSize = sizeOf(imageBuffer);
      if (
        computedSize.width === undefined ||
        computedSize.height === undefined
      ) {
        throw new Error("Could not compute image size");
      }
      width = computedSize.width;
      height = computedSize.height;
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
