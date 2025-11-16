const fs = require('fs');
const path = require('path');

const postsJsonPath = path.join(__dirname, '..', 'lib', 'posts.json');
const postsDirectory = path.join(__dirname, '..', 'app', '(post)');

// Read posts.json
const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));

// Parse metadata object from MDX file content
function parseMetadata(fileContents) {
  const metadata = {};
  
  // Find the metadata export block start
  const exportMatch = fileContents.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!exportMatch) {
    return { metadata: null, startPos: -1, endPos: -1 };
  }
  
  // Find the start position of the metadata object
  const startPos = exportMatch.index + exportMatch[0].length - 1; // -1 to include the opening brace
  
  // Find the matching closing brace (handle nested objects)
  let braceCount = 0;
  let endPos = startPos;
  for (let i = startPos; i < fileContents.length; i++) {
    if (fileContents[i] === '{') {
      braceCount++;
    } else if (fileContents[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endPos = i;
        break;
      }
    }
  }
  
  if (braceCount !== 0) {
    return { metadata: null, startPos: -1, endPos: -1 };
  }
  
  // Extract the metadata object content (without the outer braces)
  const metadataContent = fileContents.substring(startPos + 1, endPos);
  
  // Helper function to extract string values
  const extractString = (key) => {
    const regex = new RegExp(`\\b${key}:\\s*["']([^"']+)["']`, 'i');
    const match = metadataContent.match(regex);
    return match ? match[1] : undefined;
  };
  
  // Helper function to extract number values
  const extractNumber = (key) => {
    const regex = new RegExp(`\\b${key}:\\s*(\\d+)`, 'i');
    const match = metadataContent.match(regex);
    return match ? parseInt(match[1], 10) : undefined;
  };
  
  // Extract all fields from metadata
  metadata.title = extractString('title');
  metadata.description = extractString('description') || '';
  metadata.date = (() => {
    const dateRegex = /\bdate:\s*["']?([A-Za-z]+\s+\d+,\s+\d{4}|[\d-]+)["']?/i;
    const match = metadataContent.match(dateRegex);
    return match ? match[1] : undefined;
  })();
  metadata.category = extractString('category');
  metadata.minuteToRead = extractNumber('minuteToRead');
  metadata.language = extractString('language');
  metadata.issueNumber = extractNumber('issueNumber');
  metadata.link = extractString('link');
  metadata.id = extractString('id');
  metadata.path = extractString('path');
  
  return { metadata, startPos, endPos };
}

// Extract nested object (openGraph, keywords, etc.)
function extractNestedObject(content, key) {
  const keyIndex = content.indexOf(`${key}:`);
  if (keyIndex === -1) return null;
  
  const braceStart = content.indexOf('{', keyIndex);
  const bracketStart = content.indexOf('[', keyIndex);
  
  if (braceStart !== -1 && (bracketStart === -1 || braceStart < bracketStart)) {
    // It's an object
    let braceCount = 0;
    let endPos = braceStart;
    for (let i = braceStart; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endPos = i;
          break;
        }
      }
    }
    return content.substring(keyIndex, endPos + 1);
  } else if (bracketStart !== -1) {
    // It's an array
    let bracketCount = 0;
    let endPos = bracketStart;
    for (let i = bracketStart; i < content.length; i++) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          endPos = i;
          break;
        }
      }
    }
    return content.substring(keyIndex, endPos + 1);
  }
  
  return null;
}

// Update metadata in file
function updateMetadataInFile(filePath, postData) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { metadata: existingMetadata, startPos, endPos } = parseMetadata(fileContents);
    
    if (startPos === -1 || endPos === -1) {
      console.warn(`⚠️  Could not find metadata export in ${filePath}`);
      return false;
    }
    
    const metadataContent = fileContents.substring(startPos + 1, endPos);
    
    // Build new metadata object with all fields
    const newMetadataFields = [];
    
    // Always include title (use existing if available, otherwise from postData)
    const title = existingMetadata.title || postData.title;
    if (title) {
      newMetadataFields.push(`  title: "${title.replace(/"/g, '\\"')}"`);
    }
    
    // Always include description (use existing if available, otherwise from postData)
    const description = existingMetadata.description || postData.description;
    if (description) {
      newMetadataFields.push(`  description: "${description.replace(/"/g, '\\"')}"`);
    }
    
    // Add date (from postData, always use it)
    if (postData.date) {
      newMetadataFields.push(`  date: "${postData.date}"`);
    }
    
    // Add category (from postData)
    if (postData.category) {
      newMetadataFields.push(`  category: "${postData.category}"`);
    }
    
    // Add minuteToRead (from postData)
    if (postData.minuteToRead) {
      newMetadataFields.push(`  minuteToRead: ${postData.minuteToRead}`);
    }
    
    // Add language (from postData)
    if (postData.language) {
      newMetadataFields.push(`  language: "${postData.language}"`);
    }
    
    // Add issueNumber (from postData)
    if (postData.issueNumber) {
      newMetadataFields.push(`  issueNumber: ${postData.issueNumber}`);
    }
    
    // Add link (from postData)
    if (postData.link) {
      newMetadataFields.push(`  link: "${postData.link}"`);
    }
    
    // Add id (from postData)
    if (postData.id) {
      newMetadataFields.push(`  id: "${postData.id}"`);
    }
    
    // Add path (from postData)
    if (postData.path) {
      newMetadataFields.push(`  path: "${postData.path}"`);
    }
    
    // Preserve openGraph if it exists
    const openGraph = extractNestedObject(metadataContent, 'openGraph');
    if (openGraph) {
      // Format with proper indentation
      const formattedOpenGraph = openGraph.split('\n').map((line, idx) => {
        if (idx === 0) return `  ${line.trim()}`;
        if (line.trim() === '') return '';
        return `  ${line}`;
      }).join('\n');
      newMetadataFields.push(formattedOpenGraph);
    }
    
    // Preserve keywords if they exist
    const keywords = extractNestedObject(metadataContent, 'keywords');
    if (keywords) {
      const formattedKeywords = keywords.split('\n').map((line, idx) => {
        if (idx === 0) return `  ${line.trim()}`;
        if (line.trim() === '') return '';
        return `  ${line}`;
      }).join('\n');
      newMetadataFields.push(formattedKeywords);
    }
    
    // Build new metadata export
    const newMetadata = `export const metadata = {\n${newMetadataFields.join(',\n')},\n}`;
    
    // Find where "export const metadata" starts
    const exportStartMatch = fileContents.match(/export\s+const\s+metadata\s*=\s*\{/);
    const exportStartPos = exportStartMatch.index;
    
    const beforeExport = fileContents.substring(0, exportStartPos);
    const afterMetadataEnd = fileContents.substring(endPos + 1);
    
    const newFileContents = beforeExport + newMetadata + afterMetadataEnd;
    
    fs.writeFileSync(filePath, newFileContents, 'utf8');
    console.log(`✅ Updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Process all posts
let updatedCount = 0;
let skippedCount = 0;

postsJson.posts.forEach((post) => {
  // Extract year from date
  const year = new Date(post.date).getFullYear();
  
  // Build file path
  const filePath = path.join(postsDirectory, year.toString(), post.path, 'page.mdx');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    skippedCount++;
    return;
  }
  
  if (updateMetadataInFile(filePath, post)) {
    updatedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Updated: ${updatedCount}`);
console.log(`⚠️  Skipped: ${skippedCount}`);
console.log(`📝 Total: ${postsJson.posts.length}`);

