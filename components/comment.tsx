// components/CommentSection.js
"use client";
import { useEffect } from "react";

const CommentSection = () => {
  //TODO: issueNumber as dynamic value
  // const issueNumber = "2";
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "cihat/cihat.dev"); // GitHub repo URL'si
    script.setAttribute("issue-term", "pathname"); // Yorumları URL'ye göre gruplamak için
    script.setAttribute("theme", "github-light"); // Tema seçimi
    script.setAttribute("crossOrigin", "anonymous");
    script.setAttribute("async", "true");
    script.setAttribute("issue-number", "2");

    // Eğer issueNumber mevcutsa, bunu kullan
    // if (issueNumber) {
    // }

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
