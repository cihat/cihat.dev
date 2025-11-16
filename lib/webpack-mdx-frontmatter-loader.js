/**
 * Webpack loader to remove frontmatter from MDX content
 * This prevents frontmatter from being displayed on the rendered page
 */
module.exports = function mdxFrontmatterLoader(source) {
  // Remove YAML frontmatter (--- ... ---)
  // Match frontmatter that starts with --- and ends with ---
  // Handle both single line and multi-line frontmatter
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/m;
  
  // Also handle frontmatter that might be rendered as text (without --- markers)
  // This happens when MDX processes frontmatter as content
  const frontmatterAsTextRegex = /^(id|title|date|minuteToRead|language|category|description|issueNumber):\s*[^\n]+\n?/gm;
  
  let cleanedSource = source;
  
  // First, try to remove standard YAML frontmatter
  cleanedSource = cleanedSource.replace(frontmatterRegex, '');
  
  // Then, remove any frontmatter that might have been rendered as text
  cleanedSource = cleanedSource.replace(frontmatterAsTextRegex, '');
  
  // Clean up any remaining frontmatter-like patterns
  cleanedSource = cleanedSource.replace(/^id:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^title:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^date:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^minuteToRead:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^language:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^category:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^description:\s*[^\n]+\n?/gm, '');
  cleanedSource = cleanedSource.replace(/^issueNumber:\s*[^\n]+\n?/gm, '');
  
  return cleanedSource;
};

