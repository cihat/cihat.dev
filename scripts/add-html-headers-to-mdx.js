const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

const postsDir = path.join(__dirname, '../app/(post)');

// Create a mapping of post paths to post data
const postMap = new Map();
postsData.posts.forEach((post) => {
  const year = new Date(post.date).getFullYear();
  const key = `${year}/${post.path}`;
  postMap.set(key, post);
});

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

// Process each MDX file
const mdxFiles = findMdxFiles(postsDir);

mdxFiles.forEach((filePath) => {
  try {
    const relativePath = path.relative(postsDir, filePath);
    const parts = relativePath.split(path.sep);
    const year = parts[0];
    const slug = parts.slice(1, -1).join('/');
    const key = `${year}/${slug}`;
    
    const postData = postMap.get(key);
    
    if (!postData) {
      // Skip if not in posts.json (might be a sub-page)
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has HTML header
    const hasHtmlHeader = content.includes('<span className="font-semibold">') && 
                         content.includes('• <span className="font-semibold">');
    
    if (!hasHtmlHeader) {
      // Extract title from metadata export
      let title = postData.title;
      const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([^}]+)\}/s);
      if (metadataMatch) {
        const metadataContent = metadataMatch[1];
        const titleMatch = metadataContent.match(/title:\s*["']([^"']+)["']/);
        if (titleMatch) {
          title = titleMatch[1];
        }
      }
      
      // Create HTML header
      const htmlHeader = `<h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-gray-100 leading-tight">${title}</h1>

<div className="text-sm text-gray-500 dark:text-gray-500 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
  <span className="font-semibold">${postData.date}</span> • <span className="font-semibold">${postData.category}</span> • <span>${postData.minuteToRead} mins read</span>
</div>

`;
      
      // Find where to insert (after metadata export)
      // Match multiline metadata export
      const metadataEndMatch = content.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\}\s*\n/);
      if (metadataEndMatch) {
        const insertIndex = metadataEndMatch.index + metadataEndMatch[0].length;
        // Check if h1 already exists
        if (!content.includes('<h1 className="text-5xl')) {
          content = content.slice(0, insertIndex) + htmlHeader + content.slice(insertIndex);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Added HTML header to ${slug}`);
        } else {
          console.log(`ℹ️  ${slug} already has h1 header`);
        }
      } else {
        console.log(`⚠️  Could not find metadata export in ${slug}`);
      }
    } else {
      // Update category in existing HTML header
      const categoryRegex = /(<span[^>]*>([A-Za-z]+\s+\d+,\s+\d{4})<\/span>\s*•\s*<span[^>]*>)([^<]+)(<\/span>\s*•)/;
      const match = content.match(categoryRegex);
      
      if (match) {
        const oldCategory = match[3].trim();
        if (oldCategory !== postData.category) {
          content = content.replace(categoryRegex, `$1${postData.category}$4`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Updated ${slug}: ${oldCategory} → ${postData.category}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`\n✨ Processed ${mdxFiles.length} MDX files!`);

