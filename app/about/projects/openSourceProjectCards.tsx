import { IPinnedProjects } from "@/types"

import A from "@/components/ui/a"
import { AiOutlineStar, AiOutlineBranches } from "react-icons/ai"
import Image from "next/image"
import Link from "@/app/links/[id]/page"

type CardType = {
  project: IPinnedProjects
  key: string
}

export function Card(props: CardType) {
  const { link, description, forks, image, language, languageColor, owner, repo, stars, website } = props.project

  return (
    <div className="text-sm project-card flex flex-col p-4 border radious rounded-md h-full min-h-[200px]" key={props.key}>
      <div className="flex">
        <A href={link} target="_blank" className="font-bold hover:text-[#2f81f7] dark:hover:text-[#2f81f7]">
          {repo}
        </A>
      </div>
      <div className="mt-2">
        <p>{description}</p>
      </div>
      <div className="flex items-center my-2">
        <span className="flex justify-start items-center mr-2">
          <span className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: !languageColor ? "#f1e05a" : `${languageColor}` }}
          />
          <span className="font-bold">{language}</span>
        </span>
        {
          stars > 0 ? <A href={`${link}/stargazers`} target="_blank" className="flex items-center mr-2  border-none hover:text-[#2f81f7] dark:hover:text-[#2f81f7]">
            <AiOutlineStar className="mr-0.5" />
            {stars}
          </A> : null
        }
        {
          forks > 0 ? <A href={`${link}/forks`} target="_blank" className="flex items-center border-none hover:text-[#2f81f7] dark:hover:text-[#2f81f7]">
            <AiOutlineBranches className="mr-0.5" />
            {forks}
          </A> : null
        }
      </div>
      <A href={`${link}/`} target="_blank">
        <Image src={image} width={400} height={100} alt={repo} loading="lazy" className="w-full h-auto" />
      </A>
    </div>
  )
}

type OpenSourceProjectCards = {
  pinnedProjects: IPinnedProjects[]
}

export default function OpenSourceProjectCards(props: OpenSourceProjectCards) {
  const { pinnedProjects } = props

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {
        pinnedProjects.map((project: any) =>
          <Card project={project} key={project.repo} />)
      }
    </div>
  )
}