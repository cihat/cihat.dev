const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

/**
 * FINAL clean - completely rewrite each MDX file with fresh content
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
  
  // Extract metadata block
  const metadataMatch = content.match(/^(export const metadata = \{[\s\S]*?\n\})\s*\n/m);
  if (!metadataMatch) {
    console.log(`⚠️  No metadata found in ${post.path}`);
    return;
  }

  const metadata = metadataMatch[1];
  
  // Get everything after metadata
  let afterMetadata = content.slice(metadataMatch[0].length);
  
  // Find the first actual content (skip all headers and divs)
  // Look for the first line that doesn't start with <h1, <div, or #
  const lines = afterMetadata.split('\n');
  let contentStartIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed && 
        !trimmed.startsWith('<h1') && 
        !trimmed.startsWith('<div className="text-') &&
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('</div>') &&
        !trimmed.startsWith('</h1>')) {
      contentStartIndex = i;
      break;
    }
  }
  
  const actualContent = lines.slice(contentStartIndex).join('\n').trim();
  
  // Create fresh header
  const header = `<h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-gray-100 leading-tight">${post.title}</h1>

<div className="text-sm text-gray-500 dark:text-gray-500 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
  <span className="font-semibold">${post.date}</span> • <span className="font-semibold">${post.category}</span> • <span>${post.minuteToRead} mins read</span>
</div>`;
  
  // Combine
  const finalContent = `${metadata}\n\n${header}\n\n${actualContent}\n`;
  
  fs.writeFileSync(mdxPath, finalContent, 'utf-8');
  console.log(`✓ Final clean: ${post.path}`);
});

console.log('\n✨ All MDX files completely cleaned!');

