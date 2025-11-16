const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../app/(post)');

// Map of post paths to new categories
const categoryMap = {
  '2025/boulder': 'Sport',
  '2025/music': 'Entertainment',
  '2025/askerlik': 'Personal',
  '2024/oylesine': 'Personal',
  '2023/ilk-blog-yazisi': 'Personal',
  '2023/initial-blog-post': 'Personal',
  '2021/kariyerimde-mentorlugun-onemi': 'Career',
};

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
    
    const newCategory = categoryMap[key];
    
    if (!newCategory) {
      return; // Skip if not in our map
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update category in HTML header
    const categoryRegex = /(<span[^>]*>([A-Za-z]+\s+\d+,\s+\d{4})<\/span>\s*•\s*<span[^>]*>)([^<]+)(<\/span>\s*•)/;
    const match = content.match(categoryRegex);
    
    if (match) {
      const oldCategory = match[3].trim();
      if (oldCategory === 'Etc') {
        content = content.replace(categoryRegex, `$1${newCategory}$4`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated ${slug}: Etc → ${newCategory}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`\n✨ Processed ${mdxFiles.length} MDX files!`);



