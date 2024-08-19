// components/CommentSection.js
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import postsData from "@/lib/posts.json";

const CommentSection = () => {
  const pathname = usePathname();

  const postPath = pathname.split("/").pop();
  const issueNumber = postsData.posts?.find((post) => post.path === postPath)?.issueNumber;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "cihat/cihat.dev"); // GitHub repo URL'si
    script.setAttribute("issue-term", "pathname"); // Yorumları URL'ye göre gruplamak için
    script.setAttribute("theme", "preferred-color-scheme"); // Tema seçimi
    script.setAttribute("crossOrigin", "anonymous");
    script.setAttribute("async", "true");
    script.setAttribute("issue-number", `${issueNumber}`);

    // @ts-ignore
    document.getElementById("utterances").appendChild(script);

    return () => {
      // Temizlik işlemi
      const utterances = document.getElementById("utterances");
      if (utterances) {
        utterances.innerHTML = ""; // Daha önce yüklenen script'i kaldır
      }
    };
  }, []);

  return (
    <div id="utterances">
      <noscript>Please enable JavaScript to view the comments.</noscript>
    </div>
  );
};

export default CommentSection;
