import { IRandomPhoto } from "@/types/random-photo"
import { dummyPhoto } from "./meta";

class Unsplash {
  private base_url: string = "https://api.unsplash.com";
  private client_id: string = `?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  private uiUxKeywords: string = "natural,landscape,designer,design,art,artist,illustration,illustrator,graphic,graphic design,graphic designer,web,web design,web designer,ui,ux,ui/ux,ui design,ux design,ui/ux design,ui designer";

  public photo: IRandomPhoto = dummyPhoto

  async getData(url): Promise<IRandomPhoto> {
    const res = await fetch(url, {
      method: "GET",
    })

    return await res.json();
  }

  async getRandomPhoto(): Promise<IRandomPhoto> {
    const url = `${this.base_url}/photos/random/${this.client_id}&query=${this.uiUxKeywords}`;

    if (process.env.NODE_ENV !== "development") return await this.getData(url)
    return dummyPhoto
  }
}

const unsplashInstance = new Unsplash();

export default unsplashInstance;
