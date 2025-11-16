import { IRandomPhoto } from "@/types/random-photo"
import { dummyPhoto } from "./meta";

class Unsplash {
  private base_url: string = "https://api.unsplash.com";
  private client_id: string = `?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  private uiUxKeywords: string[] = [
    "natural", "landscape", "designer", "design", "art", "artist", 
    "illustration", "illustrator", "graphic", "graphic design", 
    "graphic designer", "web", "web design", "web designer", 
    "ui", "ux", "ui/ux", "ui design", "ux design", "ui/ux design", 
    "ui designer", "minimalist", "modern", "creative", "aesthetic",
    "technology", "code", "developer", "workspace", "productivity"
  ];

  public photo: IRandomPhoto = dummyPhoto

  private getRandomKeyword(): string {
    return this.uiUxKeywords[Math.floor(Math.random() * this.uiUxKeywords.length)];
  }

  private getRandomOrientation(): string {
    const orientations = ['landscape', 'portrait', 'squarish'];
    return orientations[Math.floor(Math.random() * orientations.length)];
  }

  async getData(url): Promise<IRandomPhoto | IRandomPhoto[]> {
    try {
      const res = await fetch(url, {
        method: "GET",
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
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
    // Only check for API key, allow development and production
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return dummyPhoto
    }

    // Use random keyword, orientation, and multiple cache-busting parameters
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const randomKeyword = this.getRandomKeyword();
    const orientation = this.getRandomOrientation();
    const count = Math.floor(Math.random() * 5) + 1; // Random count between 1-5
    
    // Try to get multiple photos and pick one randomly, or use single random photo
    const url = `${this.base_url}/photos/random/${this.client_id}&query=${randomKeyword}&orientation=${orientation}&count=${count}&t=${timestamp}&r=${random}`;
    const result = await this.getData(url);
    
    // If result is an array (when count > 1), pick random one
    if (Array.isArray(result) && result.length > 0) {
      return result[Math.floor(Math.random() * result.length)];
    }
    
    return result;
  }
}

const unsplashInstance = new Unsplash();

export default unsplashInstance;
