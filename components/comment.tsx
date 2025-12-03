"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const COMMENT_ID = "utterances";
const Comment = () => {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Önceki utterances içeriğini temizle
    currentRef.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "cihat/cihat.dev");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "preferred-color-scheme");
    script.setAttribute("crossOrigin", "anonymous");
    script.setAttribute("async", "true");
    // Tam URL'i belirtmek için url attribute'unu ekle
    // Bu, GitHub OAuth callback'inin doğru URL'e yönlendirilmesini sağlar
    script.setAttribute("url", window.location.href);

    currentRef.appendChild(script);

    return () => {
      // Cleanup: script ve utterances iframe'ini kaldır
      if (currentRef) {
        currentRef.innerHTML = "";
      }
      // Utterances tarafından oluşturulan iframe'i de kaldır
      const utterancesFrame = document.querySelector('iframe[src*="utteranc.es"]');
      if (utterancesFrame) {
        utterancesFrame.remove();
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
