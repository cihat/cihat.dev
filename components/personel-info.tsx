"use client"

import NextLink from "next/link";
import Image from "next/image"
import Container from "@/components/ui/container";
import "@/public/home-styles.css";
import { BsLinkedin, BsGithub, BsMedium, BsInstagram, BsTwitter, BsMailbox, BsLink45Deg } from "react-icons/bs";

import { IRandomPhoto } from "@/types/random-photo"
import unsplash from "@/lib/unsplash";
import { useEffect, useState } from "react";

type Link = {
  name: string;
  url: string;
  icon: JSX.Element;
}
const links: Link[] = [
  {
    name: "Github",
    url: "https://github.com/cihat",
    icon: <BsGithub className="icon" fill="currentColor" />
  },
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/in/cihatsalik/",
    icon: <BsLinkedin fill="currentColor" />
  },
  {
    name: "Mail",
    url: "mailto:cihatsalik1@gmail.com",
    icon: <BsMailbox fill="currentColor" />
  },
  {
    name: "Medium",
    url: "https://cihatsalik.medium.com/",
    icon: <BsMedium fill="currentColor" />
  },
  {
    name: "Twitter",
    url: "https://twitter.com/chtslk",
    icon: <BsTwitter fill="currentColor" />
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/cihat.png/",
    icon: <BsInstagram fill="currentColor" />
  },
]

export default function PersonelInfo() {
  const [photo, setPhoto] = useState<IRandomPhoto | null>(null);

  useEffect(() => {
    (async () => {
      const photo = await unsplash.getRandomPhoto() as IRandomPhoto
      setPhoto(photo)
    })()
  }, [])

  return (
    <>
      <Container as="article" className="container flex flex-col items-start select-none">
        <h1 id="title" className="right-animation font-bold text-6xl" aria-label="">Hello 👋</h1>
        <p className="name left-animation" id="name_paragraph">My name is Cihat Salik.</p>
        <p className="right-animation">
          A curious <b>Software Engineer</b> living in <b>Istanbul/Turkey</b> who enjoys researching, learning and
          developing.&nbsp;
          I love <b>open source
            development</b> and I am building something on my <a href="https://github.com/cihat" className="inline-flex flex-row items-center font-bold"
              title="Github Profile">Github<BsLink45Deg className="inline" /></a>.
        </p>
        <div className="contact top-animation">
          <ul className="container-contact bottom-animation ">
            {
              links.map((link, index) => (
                <li className="mr-2" key={link.url}>
                  <NextLink target="_blank" href={link.url} aria-label={link.name} >
                    {link.icon}
                  </NextLink>
                </li>
              ))
            }
          </ul>
        </div>
      </Container>
      {
        photo && (
          <Container className="mt-20 p-0 flex flex-col items-center">
            <Image priority
              width={photo?.width}
              height={photo?.height}
              className="rounded-lg saturate-0 transition-all duration-700 hover:saturate-100"
              alt={photo?.alt_description}
              layout="responsive"
              src={photo?.urls?.regular} />
            <figcaption className="mt-2 text-xs">
              Photo by {photo?.user?.first_name} {photo?.user?.last_name} / Unsplash
            </figcaption>
          </Container>
        )
      }
    </>
  )

}