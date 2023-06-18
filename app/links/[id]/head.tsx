import { links } from "@/lib/meta";
import { notFound } from "next/navigation";

export default function LinkHead({ params }: { params: { id: string } }) {
  const link = links[params.id];

  if (link == null) {
    return notFound();
  }

  return (
    <>
      <meta property="og:title" content={link.title} />
      <meta property="og:site_name" content="Cihat Salik" />
      <meta property="og:description" content={link.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@chtslk" />
      <meta
        property="og:image"
        content={`https://cihat.com/og/${link.image}`}
      />
    </>
  );
}
