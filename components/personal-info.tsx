"use client"

import NextLink from "next/link";
import Image from "next/image"
import { BsLinkedin, BsGithub, BsMedium, BsInstagram, BsTwitter, BsMailbox, BsLink45Deg, BsFileText } from "react-icons/bs";

import { IRandomPhoto } from "@/types/random-photo"
import unsplash from "@/lib/unsplash";
import { useEffect, useState } from "react";
import { personalLinks } from "@/lib/meta";

export default function PersonalInfo() {
  const [photo, setPhoto] = useState<IRandomPhoto | null>(null);

  useEffect(() => {
    (async () => {
      const photo = await unsplash.getRandomPhoto() as IRandomPhoto
      setPhoto(photo)
    })()
  }, [])

  return (
    <>
      <article className="container flex flex-col items-start">
        <h1 id="title" className="right-animation font-bold text-6xl" aria-label="">Hello 👋</h1>
        <p className="name left-animation" id="name_paragraph">My name is Cihat Salik.</p>
        <p className="right-animation">
          A curious <b>Software Engineer</b> living in <b>Istanbul/Turkey</b> who enjoys<br />researching, learning and
          developing.&nbsp;
          I love <b>open source
            development</b> and<br /> I am building something on my <a href="https://github.com/cihat" className="inline-flex flex-row items-center font-bold"
              title="Github Profile">Github<BsLink45Deg className="inline" /></a>.
        </p>
        <div className="contact top-animation">
          <ul className="container-contact bottom-animation ">
            {
              personalLinks.map((link, index) => (
                <li className="mr-2" key={link.url}>
                  <NextLink target="_blank" href={link.url} aria-label={link.name} >
                    {/* create icon width name */}
                    {link?.name === "Linkedin" && <BsLinkedin className="icon" fill="currentColor" />}
                    {link?.name === "Github" && <BsGithub fill="currentColor" />}
                    {link?.name === "Medium" && <BsMedium fill="currentColor" />}
                    {link?.name === "Instagram" && <BsInstagram fill="currentColor" />}
                    {link?.name === "Twitter" && <BsTwitter fill="currentColor" />}
                    {link?.name === "Mail" && <BsMailbox fill="currentColor" />}
                    {link?.name === "CV" && <BsFileText fill="currentColor" />}
                  </NextLink>
                </li>
              ))
            }
          </ul>
        </div>
      </article>
      {
        photo && (
          <>
            <Image
              loading="lazy"
              placeholder="blur"
              quality={100}
              blurDataURL={photo?.urls?.small}
              width={photo?.width}
              height={photo?.height}
              className="mt-20 rounded-lg saturate-0 transition-all duration-700 hover:saturate-100"
              alt={photo?.alt_description}
              layout="responsive"
              src={photo?.urls?.regular} />
            <figcaption className="mt-2 text-xs text-center">
              Photo by {photo?.user?.first_name} {photo?.user?.last_name} / Unsplash
            </figcaption>
          </>
        )
      }
    </>
  )
}
