import Container from "@/components/ui/container";
import Image from "next/image";
import ProgressBar from "@/components/progress-bar";
import booksData from "@/lib/books.json";
import Head from "next/head";

type bookType = {
  title: string;
  alt: string;
  progress: number;
  bookCover: string;
  link: string;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Reading</title>
        <meta name="description" content="I'm currently reading these books" />
        <meta property="og:title" content="Reading" />
        <meta property="og:description" content="I'm currently reading these books" />
        <meta property="og:image" content="https://cihat.dev/og/og-book.png" />
        <meta property="og:url" content="https://cihat.dev/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@chtslk" />
        <meta name="twitter:creator" content="@chtslk" />
        <meta name="twitter:title" content="Reading" />
        <meta name="twitter:description" content="I'm currently reading these books" />
        <meta name="twitter:image" content="https://cihat.dev/og/og-book.png" />
      </Head>
      <Container className="px-2 min-h-[80vh] md:px-4" size="large">
        <h1 className="py-8">
          <span className="text-xl font-bold">I&apos;m currently reading these books: </span>
        </h1>
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {
            booksData &&
            booksData.books?.map((book: bookType) => (
              <a key={book.title} target="_blank" href={book.link} className="col-span-1 flex flex-col justify-end !cursor-pointer">
                <Image src={book?.bookCover} alt={book.alt} width={300} height={400} className="min-w-full" />
                <ProgressBar completed={book.progress} borderRadius="2px" bgColor="#00ce8b" labelAlignment="left" height="20px" labelColor="black" />
                <h2 className="text-lg font-bold text-center">{book.title}</h2>
              </a>
            ))
          }
        </section>
      </Container>
    </>
  )
}