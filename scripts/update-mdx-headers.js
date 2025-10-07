const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

/**
 * Script to add PostHeader and PostFooter to all MDX files
 * This ensures each post displays its own metadata correctly
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
  
  // Check if PostHeader already exists
  if (content.includes('<PostHeader')) {
    console.log(`✓ ${post.path} already has PostHeader`);
    return;
  }

  // Find where metadata ends (after the first })
  const metadataEndMatch = content.match(/^}\s*$/m);
  if (!metadataEndMatch) {
    console.log(`⚠️  No metadata found in ${post.path}`);
    return;
  }

  const metadataEndIndex = metadataEndMatch.index + metadataEndMatch[0].length;
  
  // Create PostHeader component
  const postHeader = `\n<PostHeader 
  title="${post.title}" 
  date="${post.date}" 
  category="${post.category}" 
  minuteToRead={${post.minuteToRead}} 
/>\n`;

  // Create PostFooter component
  const postFooter = `\n<PostFooter 
  url="${post.link}" 
  title="${post.title}" 
  description="${post.description.replace(/"/g, '\\"')}" 
/>`;

  // Insert PostHeader after metadata
  const beforeMetadata = content.slice(0, metadataEndIndex);
  let afterMetadata = content.slice(metadataEndIndex);
  
  // Check if PostFooter already exists
  if (!afterMetadata.includes('<PostFooter')) {
    afterMetadata = afterMetadata.trimEnd() + '\n' + postFooter + '\n';
  }
  
  // Combine with PostHeader
  const newContent = beforeMetadata + postHeader + afterMetadata;
  
  fs.writeFileSync(mdxPath, newContent, 'utf-8');
  console.log(`✓ Updated ${post.path}`);
});

console.log('\n✨ All MDX files updated!');

