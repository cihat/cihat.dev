// @ts-nocheck

import cheerio from "cheerio"
import { IPinnedProjects } from "@/types"

const aimer = async (url: string) => {
  const html = await fetch(url).then((res) => res.text());
  return cheerio.load(html);
};


export const getPinnedRepos = async () => {
  const userName = 'cihat'
  let repos: IPinnedProjects[] = []

  try {
    const url = `https://github.com/${userName}`;
    const $ = await aimer(url);
    const pinned = $(".pinned-item-list-item.public").toArray() as any;

    if (!pinned || pinned.length === 0) return [];

    for (const [index, item] of pinned.entries()) {
      const owner = getOwner($, item);
      const repo = getRepo($, item);
      const link = "https://github.com/" + (owner || userName) + "/" + repo;
      const description = getDescription($, item);
      const image = `https://opengraph.githubassets.com/1/${owner || userName
        }/${repo}`;
      const website = await getWebsite(link);
      const language = getLanguage($, item);
      const languageColor = getLanguageColor($, item);
      const stars = getStars($, item);
      const forks = getForks($, item);

      repos[index] = {
        owner: owner || userName,
        repo,
        link,
        description: description || undefined,
        image: image,
        website: website || undefined,
        language: language || undefined,
        languageColor: languageColor || undefined,
        stars: stars || 0,
        forks: forks || 0,
      };
    }
  }
  catch (error) {
    console.error(error)
  }

  return repos;
}

function getOwner($: Cheerio & Root, item: Element) {
  try {
    return $(item).find(".owner").text();
  } catch (error) {
    return undefined;
  }
}

function getRepo($: Cheerio & Root, item: Element) {
  try {
    return $(item).find(".repo").text();
  } catch (error) {
    return undefined;
  }
}

function getDescription($: Cheerio & Root, item: Element) {
  try {
    return $(item).find(".pinned-item-desc").text().trim();
  } catch (error) {
    return undefined;
  }
}

function getWebsite(repo: string) {
  return aimer(repo)
    .then(($) => {
      try {
        const site = $(".BorderGrid-cell");
        if (!site || site.length === 0) return [];

        let href;
        site.each((index, item) => {
          if (index == 0) {
            href = getHREF($, item);
          }
        });
        return href;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
}

function getHREF($: Cheerio & Root, item: Element) {
  try {
    return $(item).find('a[href^="https"]').attr("href")?.trim();
  } catch (error) {
    return undefined;
  }
}

function getImage(repo: string) {
  return aimer(repo)
    .then(($) => {
      try {
        const site = $("meta");
        if (!site || site.length === 0) return [];

        let href;
        site.each((index, item) => {
          const attr = $(item).attr("property");
          if (attr == "og:image") {
            href = getSRC($, item);
          }
        });
        return href;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
}

function getSRC($: Cheerio & Root, item: Element) {
  try {
    return $(item).attr("content")?.trim();
  } catch (error) {
    return undefined;
  }
}

function getStars($: Cheerio & Root, item: Element) {
  try {
    return $(item).find('a[href$="/stargazers"]').text().trim();
  } catch (error) {
    return 0;
  }
}

function getForks($: Cheerio & Root, item: Element) {
  try {
    return $(item).find('a[href$="/forks"]').text().trim();
  } catch (error) {
    return 0;
  }
}

function getLanguage($: Cheerio & Root, item: Element) {
  try {
    return $(item).find('[itemprop="programmingLanguage"]').text();
  } catch (error) {
    return undefined;
  }
}

function getLanguageColor($: Cheerio & Root, item: Element) {
  try {
    return $(item).find(".repo-language-color").css("background-color");
  } catch (error) {
    return undefined;
  }
}