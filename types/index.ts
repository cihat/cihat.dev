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



export type IQuote = {
  text: string
  author: string
}

export type Post = {
  viewsFormatted: string;
  views: number;
  id: string;
  path: string;
  date: string;
  title: string;
  language: string;
  minuteToRead: number;
  category: string | string[];
  description: string;
  link: string;
  issueNumber: number;
}

export type Pagination = {
  prev: Post | null;
  next: Post | null;
}

export enum CategoryEnum {
  all = "All",
  learning = "Learning",
  philosophy = "Philosophy",
  productivity = "Productivity",
  sport = "Sport",
  etc = "Etc",
  personal = "Personal",
  career = "Career",
  finance = "Finance",
  technology = "Technology",
  design = "Design",
  marketing = "Marketing",
  business = "Business",
  music = "Music",
  art = "Art",
  photography = "Photography",
  architecture = "Architecture",
  bouldering = "Bouldering",
  hiking = "Hiking",
  camping = "Camping",
  fishing = "Fishing",
  swimming = "Swimming",
  psychology = "Psychology",
  literature = "Literature",
  history = "History",
  science = "Science",
  engineering = "Engineering",
  mathematics = "Mathematics",  
}

export enum LangEnum {
  en = "en-US",
  tr = "tr-TR",
  all = "all"
}
