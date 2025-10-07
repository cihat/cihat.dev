const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

/**
 * Script to replace React components with pure MDX/Markdown
 * Removes PostHeader and PostFooter, replaces with markdown
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
  
  // Remove PostHeader if exists
  content = content.replace(/<PostHeader\s+[^>]*\/>/g, '');
  
  // Remove PostFooter if exists
  content = content.replace(/<PostFooter\s+[^>]*\/>/g, '');
  
  // Find where metadata ends
  const metadataEndMatch = content.match(/^}\s*$/m);
  if (!metadataEndMatch) {
    console.log(`⚠️  No metadata found in ${post.path}`);
    return;
  }

  const metadataEndIndex = metadataEndMatch.index + metadataEndMatch[0].length;
  
  // Create markdown header with VERY large bold title
  const mdHeader = `
<h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-gray-100 leading-tight">${post.title}</h1>

<div className="text-sm text-gray-500 dark:text-gray-500 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
  <span className="font-semibold">${post.date}</span> • <span className="font-semibold">${post.category}</span> • <span>${post.minuteToRead} mins read</span>
</div>
`;

  // Insert header after metadata
  const beforeMetadata = content.slice(0, metadataEndIndex);
  let afterMetadata = content.slice(metadataEndIndex);
  
  // Remove existing markdown h1 if present (starts with # or <h1)
  afterMetadata = afterMetadata.replace(/^\s*#\s+[^\n]+\n/g, '');
  afterMetadata = afterMetadata.replace(/<h1[^>]*>.*?<\/h1>\s*/g, '');
  
  // Remove duplicate metadata divs
  const metaDivRegex = /<div className="text-(xs|sm)[^"]*"[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*•[^<]*<\/div>\s*/g;
  let metaDivCount = 0;
  afterMetadata = afterMetadata.replace(metaDivRegex, (match) => {
    metaDivCount++;
    return metaDivCount === 1 ? '' : match; // Remove first occurrence only
  });
  
  // Clean up extra whitespace
  afterMetadata = afterMetadata.replace(/^\s+/, '\n');
  
  // Combine
  const newContent = beforeMetadata + mdHeader + afterMetadata.trimEnd() + '\n';
  
  fs.writeFileSync(mdxPath, newContent, 'utf-8');
  console.log(`✓ Updated ${post.path}`);
});

console.log('\n✨ All MDX files converted to pure markdown!');

