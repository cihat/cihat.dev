// Server-only module - uses Node.js fs and path modules
// This file should only be imported in server components and API routes
import fs from 'fs';
import path from 'path';
import type { Post } from "@/types";

// Ensure this module is not imported in client components
if (typeof window !== 'undefined') {
  throw new Error('get-posts.ts can only be used in server-side code');
}

const postsDirectory = path.join(process.cwd(), 'app/(post)');

// Recursively find all page.mdx files
function findMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file === 'page.mdx') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Extract year and slug from file path
function extractPathInfo(filePath: string): { year: string; slug: string } {
  const relativePath = path.relative(postsDirectory, filePath);
  const parts = relativePath.split(path.sep);
  const year = parts[0];
  const slug = parts.slice(1, -1).join('/'); // Remove 'page.mdx' and join remaining parts
  
  return { year, slug };
}

// Generate link from path info
function generateLink(year: string, slug: string): string {
  return `https://cihat.dev/${year}/${slug}`;
}

// Parse metadata object from MDX file content
function parseMetadata(fileContents: string): Record<string, any> {
  const metadata: Record<string, any> = {};
  
  // Find the metadata export block start
  const exportMatch = fileContents.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!exportMatch) {
    return metadata;
  }
  
  // Find the start position of the metadata object
  const startPos = exportMatch.index! + exportMatch[0].length - 1; // -1 to include the opening brace
  
  // Find the matching closing brace (handle nested objects)
  let braceCount = 0;
  let endPos = startPos;
  for (let i = startPos; i < fileContents.length; i++) {
    if (fileContents[i] === '{') {
      braceCount++;
    } else if (fileContents[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endPos = i;
        break;
      }
    }
  }
  
  if (braceCount !== 0) {
    // Couldn't find matching brace, return empty metadata
    return metadata;
  }
  
  // Extract the metadata object content (without the outer braces)
  const metadataContent = fileContents.substring(startPos + 1, endPos);
  
  // Helper function to extract string values (handles both single and double quotes)
  const extractString = (key: string): string | undefined => {
    // Match: key: "value" or key: 'value'
    // Use word boundary to avoid partial matches
    const regex = new RegExp(`\\b${key}:\\s*["']([^"']+)["']`, 'i');
    const match = metadataContent.match(regex);
    return match ? match[1] : undefined;
  };
  
  // Helper function to extract number values
  const extractNumber = (key: string): number | undefined => {
    const regex = new RegExp(`\\b${key}:\\s*(\\d+)`, 'i');
    const match = metadataContent.match(regex);
    return match ? parseInt(match[1], 10) : undefined;
  };
  
  // Helper function to extract date values (can be string or date format)
  const extractDate = (): string | undefined => {
    // Match: date: "Month Day, Year" or date: "YYYY-MM-DD"
    const dateRegex = /\bdate:\s*["']?([A-Za-z]+\s+\d+,\s+\d{4}|[\d-]+)["']?/i;
    const match = metadataContent.match(dateRegex);
    return match ? match[1] : undefined;
  };
  
  // Extract all fields from metadata
  metadata.title = extractString('title');
  metadata.description = extractString('description') || '';
  metadata.date = extractDate();
  metadata.category = extractString('category');
  metadata.minuteToRead = extractNumber('minuteToRead');
  metadata.language = extractString('language');
  metadata.issueNumber = extractNumber('issueNumber');
  metadata.link = extractString('link');
  metadata.id = extractString('id');
  metadata.path = extractString('path');
  
  // Also check openGraph.description as fallback for description
  if (!metadata.description) {
    // Find openGraph object with proper brace matching
    const openGraphStart = metadataContent.indexOf('openGraph:');
    if (openGraphStart !== -1) {
      const openGraphBraceStart = metadataContent.indexOf('{', openGraphStart);
      if (openGraphBraceStart !== -1) {
        let openGraphBraceCount = 0;
        let openGraphEndPos = openGraphBraceStart;
        for (let i = openGraphBraceStart; i < metadataContent.length; i++) {
          if (metadataContent[i] === '{') {
            openGraphBraceCount++;
          } else if (metadataContent[i] === '}') {
            openGraphBraceCount--;
            if (openGraphBraceCount === 0) {
              openGraphEndPos = i;
              break;
            }
          }
        }
        const openGraphContent = metadataContent.substring(openGraphBraceStart + 1, openGraphEndPos);
        const openGraphDesc = openGraphContent.match(/description:\s*["']([^"']+)["']/);
        if (openGraphDesc) {
          metadata.description = openGraphDesc[1];
        }
      }
    }
  }
  
  return metadata;
}

// Simple function to get all posts with default view counts
export const getPosts = (): Post[] => {
  const mdxFiles = findMdxFiles(postsDirectory);
  const posts: Post[] = [];

  mdxFiles.forEach((filePath) => {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { year, slug } = extractPathInfo(filePath);
      
      // Parse metadata from export const metadata
      const metadata = parseMetadata(fileContents);
      
      // Extract all fields from metadata
      const title = metadata.title;
      const description = metadata.description || '';
      let date = metadata.date;
      const category = metadata.category;
      const minuteToRead = metadata.minuteToRead;
      const language = metadata.language;
      const issueNumber = metadata.issueNumber;
      const link = metadata.link;
      const id = metadata.id;
      const postPath = metadata.path;
      
      // Fallback: if date is not in metadata, use year from path
      if (!date) {
        date = `January 1, ${year}`;
      }
      
      // Skip if still missing required fields
      if (!title || !date) {
        console.warn(`⚠️  Skipping ${filePath}: missing required fields (title: ${title}, date: ${date})`);
        return;
      }

      // Generate fallback values
      const finalId = id || slug.replace(/\//g, '-');
      const finalPath = postPath || slug;
      const finalLink = link || generateLink(year, slug);
      const finalMinuteToRead = minuteToRead || 5;
      const finalLanguage = language || 'en-US';
      const finalCategory = category || 'Etc';
      const finalIssueNumber = issueNumber || 0;

      const post: Post = {
        id: finalId,
        path: finalPath,
        date: date,
        title: title,
        minuteToRead: finalMinuteToRead,
        language: finalLanguage,
        category: finalCategory,
        link: finalLink,
        description: description,
        issueNumber: finalIssueNumber,
        views: 0,
        viewsFormatted: '0'
      };

      posts.push(post);
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
    }
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}
