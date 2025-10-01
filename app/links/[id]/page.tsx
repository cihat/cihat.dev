import { links } from "@/lib/meta";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

interface LinkPageProps {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ bot?: string }>;
}

export default async function Link({ params, searchParams }: LinkPageProps) {
  const { id } = await params;
  const { bot } = await searchParams;
  const link = links[id as string];

  if (!link) {
    notFound();
    return null;
  }

  const headerData = await headers();
  const userAgent = headerData.get("user-agent") || "";
  const isBot = bot || /bot/i.test(userAgent);

  if (isBot) {
    return null;
  } else {
    redirect(link.link);
    return null;
  }
}
