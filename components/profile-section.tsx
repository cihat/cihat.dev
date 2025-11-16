"use client"

import NextLink from "next/link";
import Image from "next/image";
import { BsLinkedin, BsGithub, BsMedium, BsInstagram, BsTwitter, BsMailbox, BsFileText, BsRss } from "react-icons/bs";
import { personalLinks } from "@/lib/meta";
import { IRandomPhoto } from "@/types/random-photo";
import unsplash from "@/lib/unsplash";
import { useEffect, useState } from "react";

export default function ProfileSection() {
  const [photo, setPhoto] = useState<IRandomPhoto | null>(null);

  useEffect(() => {
    (async () => {
      const photo = await unsplash.getRandomPhoto() as IRandomPhoto;
      setPhoto(photo);
    })();
  }, []);

  return (
    <article className="flex flex-col max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        About
      </h1>
      
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          I'm a Software Engineer from Istanbul, Turkey. I develop for web and iOS/macOS platforms.
        </p>
        
        <p>
          I focus on productivity, lifestyle, and utility apps. 
          Check out my apps at{" "}
          <a 
            href="https://apps.cihat.dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            apps.cihat.dev
          </a>.
        </p>
        
        <p>
          When I'm not coding, I read about philosophy and explore productivity techniques. 
          I believe in continuous learning and sharing insights.
        </p>
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          Connect
        </h2>
        <ul className="flex flex-wrap gap-3">
          {personalLinks.map((link) => (
            <li key={link.url}>
              <NextLink 
                target="_blank" 
                href={link.url} 
                aria-label={`${link.name} - Cihat Salik's ${link.name} profile`}
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={`Visit Cihat Salik's ${link.name} profile`}
              >
                {link?.name === "Linkedin" && <BsLinkedin className="w-5 h-5" fill="currentColor" />}
                {link?.name === "Github" && <BsGithub className="w-5 h-5" fill="currentColor" />}
                {link?.name === "Medium" && <BsMedium className="w-5 h-5" fill="currentColor" />}
                {link?.name === "Instagram" && <BsInstagram className="w-5 h-5" fill="currentColor" />}
                {link?.name === "Twitter" && <BsTwitter className="w-5 h-5" fill="currentColor" />}
                {link?.name === "Mail" && <BsMailbox className="w-5 h-5" fill="currentColor" />}
                {link?.name === "CV" && <BsFileText className="w-5 h-5" fill="currentColor" />}
                {link?.name === "RSS" && <BsRss className="w-5 h-5" fill="currentColor" />}
              </NextLink>
            </li>
          ))}
        </ul>
      </div>

      {photo && (
        <figure className="mt-12">
          <Image
            loading="lazy"
            placeholder="blur"
            quality={100}
            blurDataURL={photo?.urls?.small}
            width={photo?.width}
            height={photo?.height}
            className="rounded-lg w-full"
            alt={photo?.alt_description || `Random photo by ${photo?.user?.first_name} ${photo?.user?.last_name} from Unsplash`}
            src={photo?.urls?.regular}
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            Photo by{" "}
            <a 
              href={photo?.user?.links?.html} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {photo?.user?.first_name} {photo?.user?.last_name}
            </a>{" "}
            on{" "}
            <a 
              href="https://unsplash.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Unsplash
            </a>
          </figcaption>
        </figure>
      )}
    </article>
  )
}
