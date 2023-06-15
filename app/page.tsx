import NextLink from "next/link";
import Container from "@/components/ui/container";
import "@/public/home-styles.css";
import { BsLinkedin, BsGithub, BsMedium, BsInstagram, BsTwitter, BsMailbox, BsLink45Deg } from "react-icons/bs";

export default function Home() {
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

  return (
    <Container as="article" className="container flex flex-col items-start px-0 select-none">
      <h1 id="title" className="right-animation font-bold text-6xl" aria-label="">Hello 👋</h1>
      <p className="name left-animation" id="name_paragraph">My name is Cihat Salik.</p>
      <p className="right-animation">
        A curious <b>Software Engineer</b> living in <b>Istanbul/Turkey</b> who enjoys researching, learning and
        developing.&nbsp;
        I love <b>open source
          development</b> and I am building something on my <a href="https://github.com/cihat" className="inline-flex flex-row items-center font-bold"
            title="Github Profile">Github<BsLink45Deg className="inline" /></a>.
      </p>
      <div className="contact top-animatio">
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
  )
}

