"use client";

import Claps from "./claps";

export default function ClapsButton({ url }) {
  return <Claps replyUrl={url} fixed="center" />;
}
