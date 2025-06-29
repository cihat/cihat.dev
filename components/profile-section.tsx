"use client"

import NextLink from "next/link";
import Image from "next/image"
import { BsLinkedin, BsGithub, BsMedium, BsInstagram, BsTwitter, BsMailbox, BsLink45Deg, BsFileText, BsRss } from "react-icons/bs";

import { IRandomPhoto } from "@/types/random-photo"
import unsplash from "@/lib/unsplash";
import { useEffect, useState } from "react";
import { personalLinks } from "@/lib/meta";

export default function ProfileSection() {
  const [photo, setPhoto] = useState<IRandomPhoto | null>(null);

  useEffect(() => {
    (async () => {
      const photo = await unsplash.getRandomPhoto() as IRandomPhoto
      setPhoto(photo)
    })()
  }, [])

  return (
    <>
      <article className="container flex flex-col items-start mt-10">
        <h1 id="title" className="right-animation font-bold text-4xl" aria-label="About Cihat Salik">Hello 👋</h1>
        <p className="name left-animation text-xl font-medium text-gray-700 dark:text-gray-300 mt-4 mb-6" id="name_paragraph">My name is Cihat Salik.</p>
        
        <div className="right-animation space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            A curious <strong>Software Engineer</strong> living in <strong>Istanbul, Turkey</strong> who enjoys 
            researching, learning and developing innovative solutions. I specialize in full-stack development 
            with a focus on <strong>JavaScript</strong>, <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Next.js</strong>.
          </p>
          
          <p>
            I love <strong>open source development</strong> and am passionate about sharing knowledge through 
            blogging and contributing to the developer community. You can explore my projects and contributions 
            on my <a href="https://github.com/cihat" className="inline-flex flex-row items-center font-bold text-blue-600 dark:text-blue-400 hover:underline" title="Cihat Salik's Github Profile">
              Github<BsLink45Deg className="inline ml-1" />
            </a>.
          </p>
          
          <p>
            When I'm not coding, I enjoy reading about <strong>stoic philosophy</strong>, exploring 
            <strong>productivity techniques</strong>, and continuously expanding my knowledge in software engineering. 
            I believe in the power of <strong>continuous learning</strong> and sharing insights with fellow developers.
          </p>
        </div>
        
        <div className="contact top-animation mt-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Connect with me</h2>
          <ul className="container-contact bottom-animation flex flex-wrap gap-3">
            {
              personalLinks.map((link, index) => (
                <li key={link.url}>
                  <NextLink 
                    target="_blank" 
                    href={link.url} 
                    aria-label={`${link.name} - Cihat Salik's ${link.name} profile`}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
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
              ))
            }
          </ul>
        </div>
      </article>
      {
        photo && (
          <figure className="mt-20">
            <Image
              loading="lazy"
              placeholder="blur"
              quality={100}
              blurDataURL={photo?.urls?.small}
              width={photo?.width}
              height={photo?.height}
              className="rounded-lg saturate-0 transition-all duration-700 hover:saturate-100"
              alt={photo?.alt_description || `Random photo by ${photo?.user?.first_name} ${photo?.user?.last_name} from Unsplash`}
              layout="responsive"
              src={photo?.urls?.regular} 
            />
            <figcaption className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Photo by <a 
                href={photo?.user?.links?.html} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {photo?.user?.first_name} {photo?.user?.last_name}
              </a> on <a 
                href="https://unsplash.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Unsplash
              </a>
            </figcaption>
          </figure>
        )
      }
    </>
  )
}
