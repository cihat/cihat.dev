
import OpenSourceProjectCards from "./openSourceProjectCards";
import { getPinnedRepos } from "@/lib/get-pinned-repos";
import Container from "@/components/ui/container";
import { pinnedProjects } from "@/lib/pinned-projects";

export default async function Projects() {
  const pinnedRepos = await getPinnedRepos() || pinnedProjects

  return (
    <Container className="flex min-h-screen flex-col left-animation" as="main">
      {/* <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Projects
        </h2>
      </div> */}
      <div className="py-1">
        <h5 className="pb-3">
          <span className="text-xl font-bold tracking-tight text-black dark:text-white">
            Open Source Projects
          </span>
        </h5>
        <OpenSourceProjectCards pinnedProjects={pinnedRepos} />
      </div>

      {/* <div className="py-1">
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
      </div> */}
    </Container>
  )
}