import { ILink } from "@/types";
import { BookmarkType } from "@/store/types";

type Result = {
  result: boolean;
  count: number;
  collectionId: number;
  items: ILink[];
};

export default class Raindrop {
  private readonly token: string;
  private readonly url = "https://api.raindrop.io";
  private readonly isInitialized: boolean;

  constructor() {
    this.token = process.env.RAINDROP_ACCESS_TOKEN || '';
    this.isInitialized = !!this.token;
    
    if (!this.token) {
      console.warn('⚠️  RAINDROP_ACCESS_TOKEN is not set. Bookmarks features will not work.');
    }
  }

  private normalizeData(data: ILink[]): ILink[] {
    if (!Array.isArray(data)) {
      console.warn('⚠️  normalizeData received non-array data:', typeof data);
      return [];
    }

    return data.map((bookmark) => {
      if (!bookmark || typeof bookmark !== 'object') {
        console.warn('⚠️  Invalid bookmark item:', bookmark);
        return null;
      }

      const { _id, type, created, title, link, excerpt, domain, tags, cover } = bookmark;
      
      return {
        _id: _id || '',
        type: type || '',
        created: created || '',
        title: title || '',
        link: link || '',
        excerpt: excerpt || '',
        domain: domain || '',
        tags: Array.isArray(tags) ? tags : [],
        cover: cover || ''
      };
    }).filter(Boolean) as ILink[];
  }

  public async getBookmark({
    perPage = 50,
    page = 0,
    sort = "-created",
    search = "",
    collectionId = BookmarkType.DesignArtMusic
  }: {
    perPage?: number;
    page?: number;
    sort?: "-created" | "created";
    search?: string;
    collectionId: BookmarkType;
  }): Promise<ILink[]> {
    
    // Early return if not initialized
    if (!this.isInitialized || !this.token) {
      console.warn('⚠️  Cannot fetch bookmarks: RAINDROP_ACCESS_TOKEN is missing');
      return [];
    }

    try {
      // Validate inputs
      if (!collectionId) {
        console.warn('⚠️  Cannot fetch bookmarks: Collection ID is missing');
        return [];
      }

      const apiUrl = `${this.url}/rest/v1/raindrops/${collectionId}`;
      const url = new URL(apiUrl);

      // Set query parameters
      url.searchParams.set("perpage", String(perPage));
      url.searchParams.set("page", String(page));
      url.searchParams.set("sort", sort);
      if (search) {
        url.searchParams.set("search", search);
      }

      console.log(`🔄 Fetching bookmarks from: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
        },
        // Add timeout and signal for better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch (textError) {
          console.warn('Could not read error response text:', textError);
        }

        console.error(`⚠️  Raindrop API error: ${errorMessage}`);
        
        switch (response.status) {
          case 401:
            console.error("⚠️  Authentication failed. Please check your RAINDROP_ACCESS_TOKEN environment variable.");
            break;
          case 403:
            console.error("⚠️  Access forbidden. Please check your token permissions.");
            break;
          case 404:
            console.error("⚠️  Collection not found. Please check the collection ID.");
            break;
          case 429:
            console.error("⚠️  Rate limit exceeded. Please try again later.");
            break;
          default:
            console.error(`⚠️  Unexpected API error: ${response.status}`);
        }
        
        return [];
      }

      const data: Result = await response.json();
      
      if (!data || !Array.isArray(data.items)) {
        console.warn('⚠️  Invalid response format from Raindrop API');
        return [];
      }

      console.log(`✅ Successfully fetched ${data.items.length} bookmarks`);

      // Handle pagination
      if (data.items.length === perPage && data.items.length > 0) {
        const nextPageItems = await this.getBookmark({
          page: page + 1,
          perPage,
          sort,
          search,
          collectionId
        });
        return [...data.items, ...nextPageItems];
      }

      return this.normalizeData(data.items) || [];
      
    } catch (error) {
      // More specific error handling
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('⚠️  Network error: Unable to connect to Raindrop API. This might be due to:');
        console.warn('   - Network connectivity issues');
        console.warn('   - CORS restrictions');
        console.warn('   - API service unavailable');
        console.warn('   - Environment variable missing in production');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn('⚠️  Request timeout: Raindrop API took too long to respond');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('⚠️  Failed to fetch bookmarks:', errorMessage);
        console.error('⚠️  Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          tokenPresent: !!this.token,
          baseUrl: this.url,
          collectionId
        });
      }
      return [];
    }
  }
}
