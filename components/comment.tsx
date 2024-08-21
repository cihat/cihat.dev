"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const COMMENT_ID = "utterances";
const Comment = () => {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "cihat/cihat.dev");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "preferred-color-scheme");
    script.setAttribute("crossOrigin", "anonymous");
    script.setAttribute("async", "true");

    ref.current?.appendChild(script);

    return () => {
      if (ref.current) {
        // @ts-ignore
        ref.current = null;
      }
    };
  }, [pathname]);

  return (
    <div id={COMMENT_ID} ref={ref}>
      <noscript>Please enable JavaScript to view the comments.</noscript>
    </div>
  );
};

export default Comment;
