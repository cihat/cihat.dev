const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../app/(post)/2025/system-design');

// System Design sub-pages should have "Technical" category
const systemDesignCategory = 'Technical';

// Recursively find all page.mdx files in system-design directory
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
    
    // Skip the main system-design page (it's already handled)
    if (relativePath === 'page.mdx') {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has HTML header
    const hasHtmlHeader = content.includes('<span className="font-semibold">') && 
                         content.includes('• <span className="font-semibold">');
    
    if (!hasHtmlHeader) {
      // Extract title from metadata export
      let title = 'System Design';
      const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\}/);
      if (metadataMatch) {
        const metadataContent = metadataMatch[0];
        const titleMatch = metadataContent.match(/title:\s*["']([^"']+)["']/);
        if (titleMatch) {
          title = titleMatch[1];
        }
      }
      
      // Extract date from first h1 or use default
      let date = 'August 22, 2025';
      const dateMatch = content.match(/<span[^>]*>([A-Za-z]+\s+\d+,\s+\d{4})<\/span>/);
      if (dateMatch) {
        date = dateMatch[1];
      }
      
      // Extract minuteToRead or use default
      let minuteToRead = 5;
      const minsMatch = content.match(/(\d+)\s*mins?\s*read/i);
      if (minsMatch && minsMatch[1]) {
        minuteToRead = parseInt(minsMatch[1], 10);
      }
      
      // Create HTML header
      const htmlHeader = `<h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-gray-100 leading-tight">${title}</h1>

<div className="text-sm text-gray-500 dark:text-gray-500 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
  <span className="font-semibold">${date}</span> • <span className="font-semibold">${systemDesignCategory}</span> • <span>${minuteToRead} mins read</span>
</div>

`;
      
      // Find where to insert (after metadata export)
      const metadataEndMatch = content.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\}\s*\n/);
      if (metadataEndMatch) {
        const insertIndex = metadataEndMatch.index + metadataEndMatch[0].length;
        // Check if h1 already exists
        if (!content.includes('<h1 className="text-5xl')) {
          content = content.slice(0, insertIndex) + htmlHeader + content.slice(insertIndex);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Added HTML header to ${relativePath}`);
        } else {
          console.log(`ℹ️  ${relativePath} already has h1 header`);
        }
      } else {
        // If no metadata export, add at the beginning
        if (!content.includes('<h1 className="text-5xl')) {
          content = htmlHeader + content;
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Added HTML header to ${relativePath} (no metadata)`);
        }
      }
    } else {
      // Update category in existing HTML header
      const categoryRegex = /(<span[^>]*>([A-Za-z]+\s+\d+,\s+\d{4})<\/span>\s*•\s*<span[^>]*>)([^<]+)(<\/span>\s*•)/;
      const match = content.match(categoryRegex);
      
      if (match) {
        const oldCategory = match[3].trim();
        if (oldCategory !== systemDesignCategory) {
          content = content.replace(categoryRegex, `$1${systemDesignCategory}$4`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Updated ${relativePath}: ${oldCategory} → ${systemDesignCategory}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`\n✨ Processed ${mdxFiles.length} MDX files!`);

