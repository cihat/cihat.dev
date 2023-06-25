export type ILink = {
  _id: number; // 254677638,
  type: "link" | "article" | "video" | "document" | "audio"; // 'link',
  created: string; // '2021-03-28T01:37:53.050Z'
  title: string; // 'Figma to React – Convert Figma designs to React code',
  link: string; // 'https://figma-to-react.vercel.app/'
  excerpt: string; // 'Convert Figma designs to React code (React Native and Next.js)',
  domain: string; // 'figma-to-react.vercel.app',
  tags: string[]; // [ 'history', 'frontend', 'figma', 'react' ],
  cover: string; // 'https://rdl.ink/render/https%3A%2F%2Ffigma-to-react.vercel.app%2F',
}

export type IPinnedProjects = {
  owner: string;
  repo: string;
  link: string;
  description: string;
  image: string;
  website?: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
}

export type IQuote = {
  text: string
  author: string
}