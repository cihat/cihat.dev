import { IRandomPhoto } from "@/types/random-photo"
import { dummyPhoto } from "./meta";

class Unsplash {
  private base_url: string = "https://api.unsplash.com";
  private client_id: string = `?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  public photo: IRandomPhoto = dummyPhoto

  async getData(url): Promise<IRandomPhoto> {
    const res = await fetch(url, {
      method: "GET",

    })

    return await res.json();
  }

  async getRandomPhoto(): Promise<IRandomPhoto> {
    const url = `${this.base_url}/photos/random/${this.client_id}`
    // if (!this.photo?.urls || process.env.NODE_ENV !== "development") return await this.getData(url)
    if (process.env.NODE_ENV !== "development") return await this.getData(url)
    return dummyPhoto
  }
}

export default new Unsplash();