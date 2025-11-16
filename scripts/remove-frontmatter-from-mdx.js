const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, '../app/(post)');

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
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    
    // Only process if frontmatter exists
    if (parsed.data && Object.keys(parsed.data).length > 0) {
      // Keep only the content (without frontmatter) and metadata export
      // Find where metadata export starts
      const contentWithoutFrontmatter = parsed.content;
      
      // Write back without frontmatter
      fs.writeFileSync(filePath, contentWithoutFrontmatter, 'utf8');
      console.log(`✓ Removed frontmatter from ${path.relative(postsDir, filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`\n✨ Processed ${mdxFiles.length} MDX files!`);

