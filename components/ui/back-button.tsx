"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/posts");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-3 mb-6 text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group cursor-pointer py-2"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      <span>Back</span>
    </button>
  );
}

