"use client";

import { useEffect, useState } from "react";

const ReadingProgressIndicator = () => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const scrollListener = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollPosition = window.scrollY;
      
      const progress = Math.max(0, Math.min(100, (scrollPosition / documentHeight) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", scrollListener);
    
    scrollListener();

    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-gray-200 dark:bg-gray-800">
      <div
        className="h-full bg-black dark:bg-white transition-all duration-100 ease-out"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default ReadingProgressIndicator;
