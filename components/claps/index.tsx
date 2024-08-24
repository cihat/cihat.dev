"use client";

import useIsMobile from "@/hooks/useIsMobile";
import Claps from "./claps";

export default function ClapsButton() {
  const isMobile = useIsMobile();
  return <Claps fixed={isMobile ? "center" : "right"} />;
}
