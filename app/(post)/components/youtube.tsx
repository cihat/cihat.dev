"use client";

import { Suspense } from "react";
import type { ComponentProps } from "react";
import YT from "react-youtube";

function YouTubePlaceholder() {
  return (
    <div className="block my-5 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-center items-center text-gray-500 dark:text-gray-400 h-32">
        <p>Loading YouTube video...</p>
      </div>
    </div>
  );
}

type YouTubeProps = ComponentProps<typeof YT> & {
  /** Article sütunundan taşıp daha geniş (viewport’a yakın) gösterir */
  wide?: boolean;
};

export function YouTube({
  videoId,
  start,
  className,
  wide = false,
  opts: optsProp,
  ...rest
}: YouTubeProps) {
  const opts = {
    width: "100%",
    ...(start && {
      playerVars: {
        start: start,
      },
    }),
    ...optsProp,
  };

  const wrapperClass = wide
    ? `block my-5 relative left-1/2 -translate-x-1/2 w-[min(calc(100vw-2rem),64rem)] max-w-none ${className ?? ""}`
    : `block my-5 overflow-scroll ${className ?? ""}`;

  return (
    <div className={wrapperClass}>
      <Suspense fallback={<YouTubePlaceholder />}>
        <YT videoId={videoId} opts={opts} {...rest} />
      </Suspense>
    </div>
  );
}
