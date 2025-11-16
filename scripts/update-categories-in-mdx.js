const fs = require('fs');
const path = require('path');
const postsData = require('../lib/posts.json');

const postsDir = path.join(__dirname, '../app/(post)');

// Create a mapping of post paths to categories
const categoryMap = new Map();
postsData.posts.forEach((post) => {
  const year = new Date(post.date).getFullYear();
  const key = `${year}/${post.path}`;
  categoryMap.set(key, post.category);
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
    
    const expectedCategory = categoryMap.get(key);
    
    if (!expectedCategory) {
      console.log(`⚠️  No category mapping found for ${key}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has HTML header with category
    const hasHtmlHeader = content.includes('<span className="font-semibold">') && 
                         content.includes('• <span className="font-semibold">');
    
    if (hasHtmlHeader) {
      // Update category in HTML header
      // Pattern: <span>date</span> • <span>OLD_CATEGORY</span> • <span>mins read</span>
      const categoryRegex = /(<span[^>]*>([A-Za-z]+\s+\d+,\s+\d{4})<\/span>\s*•\s*<span[^>]*>)([^<]+)(<\/span>\s*•)/;
      const match = content.match(categoryRegex);
      
      if (match) {
        const oldCategory = match[3].trim();
        if (oldCategory !== expectedCategory) {
          content = content.replace(categoryRegex, `$1${expectedCategory}$4`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Updated ${slug}: ${oldCategory} → ${expectedCategory}`);
        } else {
          console.log(`✓ ${slug} already has correct category: ${expectedCategory}`);
        }
      } else {
        console.log(`⚠️  Could not find category pattern in ${slug}`);
      }
    } else {
      console.log(`ℹ️  ${slug} has no HTML header, skipping`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`\n✨ Processed ${mdxFiles.length} MDX files!`);


