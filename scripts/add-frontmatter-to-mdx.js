const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const postsData = require('../lib/posts.json');

const postsDir = path.join(__dirname, '../app/(post)');

// Helper function to find MDX file for a post
function findMdxFile(post) {
  const year = new Date(post.date).getFullYear();
  const mdxPath = path.join(postsDir, `${year}`, post.path, 'page.mdx');
  
  // Check if file exists
  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }
  
  // Try alternative paths
  const altPaths = [
    path.join(postsDir, `${year}`, post.path.split('/').pop(), 'page.mdx'),
  ];
  
  for (const altPath of altPaths) {
    if (fs.existsSync(altPath)) {
      return altPath;
    }
  }
  
  return null;
}

// Process each post
postsData.posts.forEach((post) => {
  const mdxPath = findMdxFile(post);
  
  if (!mdxPath) {
    console.log(`⚠️  File not found for: ${post.id} (${post.path})`);
    return;
  }

  let content = fs.readFileSync(mdxPath, 'utf-8');
  
  // Check if frontmatter already exists
  const parsed = matter(content);
  if (parsed.data && Object.keys(parsed.data).length > 0 && !parsed.data.title) {
    // Has frontmatter but might be empty or different format
    console.log(`ℹ️  ${post.id} already has frontmatter, checking...`);
  }
  
  // Create frontmatter object
  const frontmatter = {
    id: post.id,
    title: post.title,
    date: post.date,
    minuteToRead: post.minuteToRead,
    language: post.language,
    category: post.category,
    description: post.description,
    issueNumber: post.issueNumber,
  };
  
  // If frontmatter exists, merge it; otherwise create new
  const existingData = parsed.data || {};
  const mergedData = { ...existingData, ...frontmatter };
  
  // Reconstruct file with frontmatter
  const newContent = matter.stringify(parsed.content, mergedData);
  
  fs.writeFileSync(mdxPath, newContent, 'utf-8');
  console.log(`✓ Added frontmatter to ${post.id}`);
});

console.log('\n✨ All MDX files processed!');

