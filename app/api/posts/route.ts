import { NextResponse } from "next/server";
import { getPostsWithViewData } from "@/lib/get-posts";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPostsWithViewData());
}