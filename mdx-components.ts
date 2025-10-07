// The code files and design of this component and mdx components were taken from the `rauch/blog` repo

import { A as a } from "app/(post)/components/a";
import { P as p } from "app/(post)/components/p";
import { H1 } from "app/(post)/components/h1";
import { H2 as h2 } from "app/(post)/components/h2";
import { H3 as h3 } from "app/(post)/components/h3";
import { OL as ol } from "app/(post)/components/ol";
import { UL as ul } from "app/(post)/components/ul";
import { LI as li } from "app/(post)/components/li";
import { HR as hr } from "app/(post)/components/hr";
import { Code as code } from "app/(post)/components/code";
import { Tweet } from "app/(post)/components/tweet";
import { Image } from "app/(post)/components/image";
import { Figure } from "app/(post)/components/figure";
import { Snippet } from "app/(post)/components/snippet";
import { Caption } from "app/(post)/components/caption";
import { Callout } from "app/(post)/components/callout";
import { YouTube } from "app/(post)/components/youtube";
import { Ref, FootNotes, FootNote } from "app/(post)/components/footnotes";
import { Blockquote } from "app/(post)/components/blockquote";
import { Reading } from "app/(post)/components/reading";
import { RandomQuote } from "./components/ui/quote";
import { CodeSnippet } from "./app/(post)/components/code-snippet";
import { Box } from "./app/(post)/components/box";
import { Spotify } from "./app/(post)/components/spotify";
import CAPTheoremAnalysis from "./components/system-design/cap-teorem";

export function useMDXComponents(components: {
  [component: string]: React.ComponentType;
}) {
  return {
    ...components,
    a,
    H1,
    h2,
    h3,
    p,
    ol,
    ul,
    li,
    hr,
    code,
    pre: Snippet,
    img: Image,
    Blockquote,
    Tweet,
    Image,
    Figure,
    Snippet,
    Caption,
    Callout,
    YouTube,
    Ref,
    FootNotes,
    FootNote,
    Reading,
    Quote: RandomQuote,
    CodeSnippet,
    Box,
    Spotify,
    CAPTheoremAnalysis,
  };
}
