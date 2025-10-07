const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

/**
 * Clean all MDX files - remove duplicates and apply fresh formatting
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
  
  // Find where metadata ends
  const metadataMatch = content.match(/^export const metadata = \{[\s\S]*?\n\}\s*\n/m);
  if (!metadataMatch) {
    console.log(`⚠️  No metadata found in ${post.path}`);
    return;
  }

  const metadata = metadataMatch[0];
  let bodyContent = content.slice(metadata.length);
  
  // Remove ALL existing h1 tags and metadata divs
  bodyContent = bodyContent.replace(/<h1[^>]*>.*?<\/h1>\s*/g, '');
  bodyContent = bodyContent.replace(/<div className="text-(xs|sm)[^"]*"[^>]*>.*?<\/div>\s*/g, '');
  bodyContent = bodyContent.replace(/^\s*#\s+[^\n]+\n/gm, '');
  
  // Clean up excessive whitespace
  bodyContent = bodyContent.replace(/^\s+/, '\n');
  bodyContent = bodyContent.trimStart();
  
  // Create the header
  const header = `<h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-gray-100 leading-tight">${post.title}</h1>

<div className="text-sm text-gray-500 dark:text-gray-500 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
  <span className="font-semibold">${post.date}</span> • <span className="font-semibold">${post.category}</span> • <span>${post.minuteToRead} mins read</span>
</div>

`;
  
  // Combine everything
  const finalContent = metadata + '\n' + header + bodyContent;
  
  fs.writeFileSync(mdxPath, finalContent, 'utf-8');
  console.log(`✓ Cleaned ${post.path}`);
});

console.log('\n✨ All MDX files cleaned!');

