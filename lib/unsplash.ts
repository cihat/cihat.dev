import { IRandomPhoto } from "@/types/random-photo"
import { dummyPhoto } from "./meta";

class Unsplash {
  private base_url: string = "https://api.unsplash.com";
  private client_id: string = `?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  private uiUxKeywords: string = "natural,landscape,designer,design,art,artist,illustration,illustrator,graphic,graphic design,graphic designer,web,web design,web designer,ui,ux,ui/ux,ui design,ux design,ui/ux design,ui designer";

  public photo: IRandomPhoto = dummyPhoto

  async getData(url): Promise<IRandomPhoto> {
    // Don't make external calls during development
    if (process.env.NODE_ENV === "development") {
      return dummyPhoto
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        cache: 'no-store',
      })

      if (!res.ok) {
        console.warn(`⚠️  Unsplash API request failed: ${res.status} ${res.statusText}`)
        return dummyPhoto
      }

      return await res.json();
    } catch (error) {
      console.warn('⚠️  Failed to fetch from Unsplash:', error)
      return dummyPhoto
    }
  }

  async getRandomPhoto(): Promise<IRandomPhoto> {
    // Don't make external calls during development or build time
    if (process.env.NODE_ENV === "development" || 
        process.env.NEXT_PHASE === "phase-production-build" ||
        !process.env.UNSPLASH_ACCESS_KEY) {
      return dummyPhoto
    }

    const timestamp = Date.now();
    const url = `${this.base_url}/photos/random/${this.client_id}&query=${this.uiUxKeywords}&t=${timestamp}`;
    return await this.getData(url)
  }
}

const unsplashInstance = new Unsplash();

export default unsplashInstance;
