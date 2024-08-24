"use client";
import Link from "next/link";
import { Button } from "./ui/button";

export function Logo() {
  return (
    <Link href="/">
      <Button className="text-md md:text-lg whitespace-nowrap font-bold" variant={"ghost"}>
        Cihat Salik
      </Button>
    </Link>
  );
}
