
import OpenSourceProjectCards from "./openSourceProjectCards";
import { IPinnedProjects } from "@/types"
import { getPinnedRepos } from "@/lib/get-pinned-repos";
import Container from "@/components/ui/container";

const pinnedProjects: IPinnedProjects[] = [
  {
    "owner": "cihat", "repo": "full-stack-twitter-clone", "link": "https://github.com/cihat/full-stack-twitter-clone", "description": "loading full-stack developer ðŸš€", "image": "https://opengraph.githubassets.com/1/cihat/full-stack-twitter-clone", "website": "https://full-stack-twitter-clone-frontend.vercel.app/", "language": "Vue", "languageColor": "#41b883", "stars": 84, "forks": 0
  },
  {
    "owner": "cihat", "repo": "delaygram", "link": "https://github.com/cihat/delaygram", "description": "full-stack instagram clone.", "image": "https://opengraph.githubassets.com/1/cihat/delaygram", "website": "https://instagram-clone-cihat.vercel.app", "language": "TypeScript", "languageColor": "#3178c6", "stars": 345, "forks": 45
  },
  {
    "owner": "cihat", "repo": "boilerplate-auth", "link": "https://github.com/cihat/boilerplate-auth", "description": "This is a Express + MongoDB + Docker + Jest + Vue + Pinia + And Design Boilerplate", "image": "https://opengraph.githubassets.com/1/cihat/boilerplate-auth", "language": "JavaScript", "languageColor": "#f1e05a", "stars": 53, "forks": 20
  },
  {
    "owner": "cihat", "repo": "sync", "link": "https://github.com/cihat/sync", "description": "This is a developer-friendly command line interface (CLI) tool that allows users to customize and pull, push, and synchronize RDS for their preferred projects in the specified file path.", "image": "https://opengraph.githubassets.com/1/cihat/sync", "website": "https://www.npmjs.com/package/pull-push-sync", "language": "JavaScript", "languageColor": "#f1e05a", "stars": 14, "forks": 0
  },
]

export default async function Projects() {
  const pinnedRepos = await getPinnedRepos() || pinnedProjects

  return (
    <Container className="flex min-h-screen flex-col px-0" as="main" size="large">
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Projects
        </h2>
      </div>
      <div className="py-1">
        <h5 className="py-2">
          <span className="text-xl font-bold tracking-tight text-black dark:text-white">
            Open Source Projects
          </span>
        </h5>
        <OpenSourceProjectCards pinnedProjects={pinnedRepos} />
      </div>

      <div className="py-1">
        <h5 className="py-2">
          <span className="text-xl font-bold tracking-tight text-black dark:text-white">
            Business Projects
          </span>
          <div>
            <h4>
              <span className="text-lg font-bold tracking-tight text-black dark:text-white">
                Coming Soon
              </span>
            </h4>
          </div>
        </h5>
      </div>
    </Container>
  )
}