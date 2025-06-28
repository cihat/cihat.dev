"use client";

import { Suspense } from "react";
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

export function YouTube(props: any) {
  return (
    <div className="block my-5 overflow-scroll">
      <Suspense fallback={<YouTubePlaceholder />}>
        <YT {...props} opts={{ width: "100%", ...props.opts }} />
      </Suspense>
    </div>
  );
}
