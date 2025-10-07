const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

/**
 * Fix MDX syntax errors - remove orphaned closing tags
 */

const postsDir = path.join(__dirname, '../app/(post)');

postsData.posts.forEach((post) => {
  const year = new Date(post.date).getFullYear();
  const mdxPath = path.join(postsDir, `${year}`, post.path, 'page.mdx');
  
  if (!fs.existsSync(mdxPath)) {
    console.log(`⚠️  File not found: ${mdxPath}`);
    return;
  }

  let content = fs.readFileSync(mdxPath, 'utf-8');
  
  // Extract metadata
  const metadataMatch = content.match(/^(export const metadata = \{[\s\S]*?\n\})\s*\n/m);
  if (!metadataMatch) {
    console.log(`⚠️  No metadata in ${post.path}`);
    return;
  }

  const metadata = metadataMatch[1];
  let afterMetadata = content.slice(metadataMatch[0].length);
  
  // Remove ALL h1 tags and metadata divs completely
  afterMetadata = afterMetadata.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, '');
  afterMetadata = afterMetadata.replace(/<div className="text-[^"]*"[^>]*>[\s\S]*?<\/div>/g, '');
  
  // Remove orphaned closing tags and spans
  afterMetadata = afterMetadata.replace(/<\/div>\s*/g, '');
  afterMetadata = afterMetadata.replace(/<span[^>]*>[^<]*<\/span>\s*•?\s*/g, '');
  afterMetadata = afterMetadata.replace(/^\s*•\s*/gm, '');
  
  // Remove markdown headers
  afterMetadata = afterMetadata.replace(/^\s*#+\s+.*$/gm, '');
  
  // Clean up excessive whitespace
  afterMetadata = afterMetadata.replace(/\n{3,}/g, '\n\n').trim();
  
  // Create clean header
  const header = `<h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-gray-100 leading-tight">${post.title}</h1>

<div className="text-sm text-gray-500 dark:text-gray-500 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
  <span className="font-semibold">${post.date}</span> • <span className="font-semibold">${post.category}</span> • <span>${post.minuteToRead} mins read</span>
</div>`;
  
  // Combine
  const finalContent = `${metadata}\n\n${header}\n\n${afterMetadata}\n`;
  
  fs.writeFileSync(mdxPath, finalContent, 'utf-8');
  console.log(`✓ Fixed ${post.path}`);
});

console.log('\n✨ All MDX syntax errors fixed!');

