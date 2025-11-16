#!/usr/bin/env node

/**
 * Generate posts cache files for Cloudflare Workers deployment
 * This script reads all MDX posts and generates cache files in multiple formats
 */

const fs = require('fs');
const path = require('path');

// Import getPosts function (we need to use require since this is a Node.js script)
// We'll need to replicate the logic here since we can't easily import TypeScript

const postsDirectory = path.join(process.cwd(), 'app/(post)');

// Recursively find all page.mdx files
function findMdxFiles(dir, fileList = []) {
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
function extractPathInfo(filePath) {
  const relativePath = path.relative(postsDirectory, filePath);
  const parts = relativePath.split(path.sep);
  const year = parts[0];
  const slug = parts.slice(1, -1).join('/'); // Remove 'page.mdx' and join remaining parts
  
  return { year, slug };
}

// Generate link from path info
function generateLink(year, slug) {
  return `https://cihat.dev/${year}/${slug}`;
}

// Parse metadata object from MDX file content
function parseMetadata(fileContents) {
  const metadata = {};
  
  // Find the metadata export block start
  const exportMatch = fileContents.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!exportMatch) {
    return metadata;
  }
  
  // Find the start position of the metadata object
  const startPos = exportMatch.index + exportMatch[0].length - 1; // -1 to include the opening brace
  
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
    return metadata;
  }
  
  // Extract the metadata object content (without the outer braces)
  const metadataContent = fileContents.substring(startPos + 1, endPos);
  
  // Helper function to extract string values
  const extractString = (key) => {
    const regex = new RegExp(`\\b${key}:\\s*["']([^"']+)["']`, 'i');
    const match = metadataContent.match(regex);
    return match ? match[1] : undefined;
  };
  
  // Helper function to extract array values
  const extractArray = (key) => {
    const arrayStartRegex = new RegExp(`\\b${key}:\\s*\\[`, 'i');
    const arrayStartMatch = metadataContent.match(arrayStartRegex);
    if (!arrayStartMatch) return undefined;
    
    const startPos = arrayStartMatch.index + arrayStartMatch[0].length;
    let bracketCount = 1;
    let endPos = startPos;
    
    for (let i = startPos; i < metadataContent.length; i++) {
      if (metadataContent[i] === '[') {
        bracketCount++;
      } else if (metadataContent[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          endPos = i;
          break;
        }
      }
    }
    
    if (bracketCount !== 0) return undefined;
    
    const arrayContent = metadataContent.substring(startPos, endPos);
    const stringMatches = arrayContent.matchAll(/["']([^"']+)["']/g);
    const values = [];
    for (const match of stringMatches) {
      values.push(match[1]);
    }
    
    return values.length > 0 ? values : undefined;
  };
  
  // Helper function to extract number values
  const extractNumber = (key) => {
    const regex = new RegExp(`\\b${key}:\\s*(\\d+)`, 'i');
    const match = metadataContent.match(regex);
    return match ? parseInt(match[1], 10) : undefined;
  };
  
  // Helper function to extract date values
  const extractDate = () => {
    const dateRegex = /\bdate:\s*["']?([A-Za-z]+\s+\d+,\s+\d{4}|[\d-]+)["']?/i;
    const match = metadataContent.match(dateRegex);
    return match ? match[1] : undefined;
  };
  
  // Extract all fields from metadata
  metadata.title = extractString('title');
  metadata.description = extractString('description') || '';
  metadata.date = extractDate();
  metadata.category = extractArray('category') || extractString('category');
  metadata.minuteToRead = extractNumber('minuteToRead');
  metadata.language = extractString('language');
  metadata.issueNumber = extractNumber('issueNumber');
  metadata.link = extractString('link');
  metadata.id = extractString('id');
  metadata.path = extractString('path');
  
  // Also check openGraph.description as fallback for description
  if (!metadata.description) {
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

// Get all posts
function getPosts() {
  const mdxFiles = findMdxFiles(postsDirectory);
  const posts = [];

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

      const post = {
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

// Generate cache files
function generateCache() {
  console.log('🔄 Generating posts cache...');
  
  const posts = getPosts();
  console.log(`✅ Found ${posts.length} posts`);

  // Generate JSON files
  const jsonOutput = JSON.stringify(posts, null, 2);
  
  // Write to lib/posts-cache.json
  const libCachePath = path.join(process.cwd(), 'lib', 'posts-cache.json');
  fs.writeFileSync(libCachePath, jsonOutput, 'utf8');
  console.log(`✅ Written to ${libCachePath}`);

  // Write to public/posts-cache.json
  const publicCachePath = path.join(process.cwd(), 'public', 'posts-cache.json');
  fs.writeFileSync(publicCachePath, jsonOutput, 'utf8');
  console.log(`✅ Written to ${publicCachePath}`);

  // Generate TypeScript file
  const tsOutput = `// Auto-generated file - do not edit manually
// Generated at build time from MDX files
import type { Post } from "@/types";

export const postsCache: Post[] = ${JSON.stringify(posts, null, 2)};
`;
  
  const tsCachePath = path.join(process.cwd(), 'lib', 'posts-cache.ts');
  fs.writeFileSync(tsCachePath, tsOutput, 'utf8');
  console.log(`✅ Written to ${tsCachePath}`);

  console.log(`\n✨ Successfully generated cache for ${posts.length} posts!`);
}

// Run the script
try {
  generateCache();
} catch (error) {
  console.error('❌ Error generating posts cache:', error);
  process.exit(1);
}

