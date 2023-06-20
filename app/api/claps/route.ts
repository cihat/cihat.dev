import { NextResponse } from "next/server";
import createClapsAPI from "@upstash/claps/api"

export const dynamic = "force-dynamic";

export async function GET() {
  return await createClapsAPI({});
}