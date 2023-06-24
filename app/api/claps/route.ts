import redis from "@/lib/redis"
import { NextApiRequest, } from "next";
import { NextResponse, NextRequest } from "next/server"
import postsData from "@/lib/posts.json";
import commaNumber from "comma-number"
import { getData, generateKey, getIP, generateHash, MAX_CLAPS } from "./utils";


export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? null;
  const post = postsData.posts.find(post => post.id === id);

  if (id === null) {
    return NextResponse.json(
      {
        error: {
          message: 'Missing "id" query',
          code: "MISSING_ID",
        },
      },
      { status: 400 }
    );
  }

  if (post == null) {
    return NextResponse.json(
      {
        error: {
          message: "Unknown post",
          code: "UNKNOWN_POST",
        },
      },
      { status: 400 }
    );
  }
}

const maxClaps = 100_000_000_000_000

export async function POST(req: NextRequest & NextApiRequest & Request) {
  const { postId, score, key } = await req.json();

  const RAW_IP = getIP(req);
  const KEY = generateKey(req, postId);
  const HASH_IP = generateHash(RAW_IP);

  const data = await getData(KEY, HASH_IP);
  return NextResponse.json({
    ...data, maxClaps
  });
}

export async function PATCH(req: NextApiRequest & NextRequest, res: NextResponse) {
  const { score, key, postId } = await req.json();

  console.log('key', key)

  const RAW_IP = getIP(req);
  const KEY = generateKey(req, postId);
  const HASH_IP = generateHash(RAW_IP);

  let addScore = Number(score) || 0;

  const { userScore } = await getData(KEY, HASH_IP);

  if (userScore >= maxClaps) {
    throw new Error("You have reached the maximum clap limit");
  }

  // if the total value is higher than the max value, we need to remove some claps
  if (userScore + addScore > maxClaps) {
    addScore = addScore - (userScore + addScore - maxClaps);
  }

  await redis.zincrby(KEY, addScore, HASH_IP);

  const data = await getData(KEY, HASH_IP);
  return NextResponse.json({
    ...data,
    maxClaps
  })
}