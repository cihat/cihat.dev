const LITERAL_API_URL = "https://literal.club/graphql/";
const LITERAL_HANDLE = "cihat";

// GraphQL fragments
const BOOK_PARTS = `
  fragment BookParts on Book {
    id
    slug
    title
    subtitle
    description
    isbn10
    isbn13
    language
    pageCount
    publishedDate
    publisher
    cover
    authors {
      id
      name
    }
    gradientColors
  }
`;

const READING_STATE_PARTS = `
  fragment ReadingStateParts on ReadingState {
    id
    status
    bookId
    profileId
    createdAt
  }
`;

const PROFILE_PARTS = `
  fragment ProfileParts on Profile {
    id
    handle
    name
    bio
    image
  }
`;

// GraphQL queries
const GET_PROFILE_BY_HANDLE = `
  ${PROFILE_PARTS}
  query getProfileParts($handle: String!) {
    profile(where: { handle: $handle }) {
      ...ProfileParts
    }
  }
`;

const GET_BOOKS_BY_READING_STATE = `
  ${BOOK_PARTS}
  query booksByReadingStateAndProfile(
    $limit: Int!
    $offset: Int!
    $readingStatus: ReadingStatus!
    $profileId: String!
  ) {
    booksByReadingStateAndProfile(
      limit: $limit
      offset: $offset
      readingStatus: $readingStatus
      profileId: $profileId
    ) {
      ...BookParts
    }
  }
`;

const GET_MY_READING_STATES = `
  ${READING_STATE_PARTS}
  ${BOOK_PARTS}
  query myReadingStates {
    myReadingStates {
      ...ReadingStateParts
      book {
        ...BookParts
      }
    }
  }
`;

// Types
export type ReadingStatus = "WANTS_TO_READ" | "IS_READING" | "FINISHED" | "DROPPED" | "NONE";

export interface LiteralAuthor {
  id: string;
  name: string;
}

export interface LiteralBook {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  isbn10?: string;
  isbn13?: string;
  language?: string;
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
  cover?: string;
  authors: LiteralAuthor[];
  gradientColors?: string[];
}

export interface LiteralReadingState {
  id: string;
  status: ReadingStatus;
  bookId: string;
  profileId: string;
  createdAt: string;
  book?: LiteralBook;
}

export interface LiteralProfile {
  id: string;
  handle: string;
  name?: string;
  bio?: string;
  image?: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
}

export default class Literal {
  private readonly token?: string;
  private readonly isInitialized: boolean;

  constructor() {
    this.token = process.env.LITERAL_API_TOKEN;
    this.isInitialized = true;
  }

  private async graphqlRequest<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token is available
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }

      const response = await fetch(LITERAL_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`⚠️  Literal API HTTP error: ${response.status} - ${errorText}`);
        return null;
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error("⚠️  Literal API GraphQL errors:", result.errors);
        return null;
      }

      return result.data || null;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn("⚠️  Literal API request timeout");
      } else {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("⚠️  Failed to fetch from Literal API:", errorMessage);
      }
      return null;
    }
  }

  /**
   * Get profile information by handle
   */
  async getProfileByHandle(handle: string = LITERAL_HANDLE): Promise<LiteralProfile | null> {
    const result = await this.graphqlRequest<{ profile: LiteralProfile }>(
      GET_PROFILE_BY_HANDLE,
      { handle }
    );

    return result?.profile || null;
  }

  /**
   * Get books by reading state and profile ID
   */
  async getBooksByReadingState(
    profileId: string,
    readingStatus: ReadingStatus,
    limit: number = 100,
    offset: number = 0
  ): Promise<LiteralBook[]> {
    const result = await this.graphqlRequest<{
      booksByReadingStateAndProfile: LiteralBook[];
    }>(GET_BOOKS_BY_READING_STATE, {
      profileId,
      readingStatus,
      limit,
      offset,
    });

    return result?.booksByReadingStateAndProfile || [];
  }

  /**
   * Get all reading states (requires authentication)
   */
  async getMyReadingStates(): Promise<LiteralReadingState[]> {
    if (!this.token) {
      console.warn("⚠️  LITERAL_API_TOKEN is required for myReadingStates query");
      return [];
    }

    const result = await this.graphqlRequest<{
      myReadingStates: LiteralReadingState[];
    }>(GET_MY_READING_STATES);

    return result?.myReadingStates || [];
  }

  /**
   * Get all books for a profile (all reading states)
   */
  async getAllBooksForProfile(profileId: string): Promise<{
    reading: LiteralBook[];
    finished: LiteralBook[];
    wantsToRead: LiteralBook[];
  }> {
    const [reading, finished, wantsToRead] = await Promise.all([
      this.getBooksByReadingState(profileId, "IS_READING"),
      this.getBooksByReadingState(profileId, "FINISHED"),
      this.getBooksByReadingState(profileId, "WANTS_TO_READ"),
    ]);

    return {
      reading,
      finished,
      wantsToRead,
    };
  }
}

