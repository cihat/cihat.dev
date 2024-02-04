import { getRepoInfo } from "@/lib/get-pinned-repos";
import { useEffect, useState } from "react";
import { Card } from "@/app/about/projects/openSourceProjectCards";
import { Loading } from "@/components/loading";
import A from "../ui/a";
import Container from "../ui/container";

export default function LearningRepo() {
  const [repoInfo, setRepoInfo] = useState(null) as any;

  useEffect(() => {
    (async () => {
      const repo = await getRepoInfo('learning');

      setRepoInfo(() => {
        return {
          link: repo.html_url,
          description: repo.description,
          forks: repo.forks,
          image: 'https://opengraph.githubassets.com/1/cihat/learning',
          language: repo.language,
          languageColor: "yellow",
          owner: repo.owner,
          repo: repo.name,
          stars: repo.stargazers_count,
          website: repo.website
        }
      });
    })()

  }, [])

  return (
    <Container as="div" size="large" className="sm:min-h-[400px] !px-0">
      <h1 className="py-8">
        <span className="text-xl font-bold">I&apos;m currently learning this technical stuff:</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <code>
            The <A href="https://github.com/cihat/learning" target="_blank">cihat/learning</A> repository is a collection of topics that I find technically challenging, intriguing, or currently working on. It serves as a personal repository where I gather projects and code snippets created while learning about these topics. Each topic has its own section within the repository, where I organize the relevant code examples and snippets accordingly.
          </code>
          <br />
        </div>
        {repoInfo ? <Card project={repoInfo} key={repoInfo.repo} /> : <Loading className="flex justify-center" />}
      </div>
    </Container>
  )
}
