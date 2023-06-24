"use client";

import Claps from "./claps";

export default function ClapsButton({ url }: { url: string }) {
  return <Claps replyUrl={url} fixed="center" />;
}
