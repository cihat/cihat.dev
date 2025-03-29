import pagesConfig from '@/lib/burden.json';
import { cache } from 'react';

export type PageConfig = {
  title: string;
  componentPath: string;
  description?: string;
  content?: {
    en: {
      title: string;
      subtitle: string;
      toggleText: string;
      themes: { title: string; content: string }[];
      footer: string;
    }
    tr: {
      title: string;
      subtitle: string;
      toggleText: string;
      themes: { title: string; content: string }[];
      footer: string;
    };
  };
  keywords?: string[];
};

export const getPageConfig = cache((slug: string): PageConfig | null => {
  return pagesConfig[slug] || null;
});

export const getAllPageSlugs = cache((): string[] => {
  return Object.keys(pagesConfig);
});
