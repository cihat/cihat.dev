'use client'

import Container from "@/components/ui/container";
import "@/public/home-styles.css";
import { BsLinkedin, BsGithub, BsMedium, BsInstagram, BsTwitter, BsMailbox, BsLink45Deg } from "react-icons/bs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  //! this page will refactor
  const { systemTheme, theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("") as any;

  useEffect(() => {
    setCurrentTheme(theme === "system" ? systemTheme : theme === "dark" ? "dark" : "light")
  }, [theme])

  return (
    <Container as="main" className="container">
      <h1 id="title" className="right-animation font-bold" aria-label="">Hello 👋</h1>
      <p className="name left-animation font-bold" id="name_paragraph">My name is Cihat Salik.</p>
      <p className="right-animation">
        A curious <b>Software Engineer</b> living in <b>Istanbul/Turkey</b> who enjoys researching, learning and
        developing.&nbsp;
        I love <b>open source
          development</b> and I am building something on my <a href="https://github.com/cihat" className="inline-flex flex-row items-center font-bold"
            title="Github Profile">Github<BsLink45Deg className="inline" /></a>.
      </p>
      <div className="contact top-animatio">
        <ul className="container-contact bottom-animation ">
          <li>
            <a target="_blank" href="https://github.com/cihat" title="Github Profile" aria-label="Github Profile">
              <BsGithub className="icon" color={currentTheme && currentTheme === "light" ? "black" : "white"} />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.linkedin.com/in/cihatsalik/" title="Linkedin Profile" aria-label="Linkedin Profile" >
              <BsLinkedin color={currentTheme && currentTheme === "light" ? "black" : "white"} />
            </a>
          </li>
          <li>
            <a target="_blank" href="mailto:cihatsalik1@gmail.com" title="e-mail" aria-label="e-mail">
              <BsMailbox color={currentTheme && currentTheme === "light" ? "black" : "white"} />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://cihatdev.medium.com/" title="Medium Profile" aria-label="Medium Profile">
              <BsMedium color={currentTheme && currentTheme === "light" ? "black" : "white"} />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.instagram.com/cihat.png" title="Instagram Profile" aria-label="Instagram Profile">
              <BsInstagram color={currentTheme && currentTheme === "light" ? "black" : "white"} />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://twitter.com/chtslk" title="Twitter Profile" aria-label="Twitter Profile">
              <BsTwitter color={currentTheme && currentTheme === "light" ? "black" : "white"} />
            </a>
          </li>
        </ul>
      </div>
    </Container>
  )
}
