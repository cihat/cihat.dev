"use client";

import { Suspense } from "react";
import { Tweet as ReactTweet } from "react-tweet";
import { Caption } from "./caption";
import type { ReactNode } from "react";

interface TweetArgs {
  id: string;
  caption: ReactNode;
}

function TweetPlaceholder({ id }: { id: string }) {
  return (
    <div className="tweet my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
        <p>Loading Tweet {id}...</p>
      </div>
    </div>
  );
}

export function Tweet({ id, caption }: TweetArgs) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <Suspense fallback={<TweetPlaceholder id={id} />}>
          <ReactTweet id={id} />
        </Suspense>
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
}
