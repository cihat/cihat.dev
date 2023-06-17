
import ProjectCards from "./projectCards";
import { IPinnedProjects } from "@/types"
import { getPinnedRepos } from "../getPinnedRepos";

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

  return <ProjectCards pinnedProjects={pinnedRepos} />
}