import type { Post } from "@/types";

export interface PostGroup {
  type: 'folder' | 'post';
  name: string;
  path: string;
  year: string;
  posts?: Post[];
  children?: PostGroup[];
  post?: Post;
}

/**
 * Groups posts by their folder structure
 * Example: system-design/acid-properties -> system-design folder with acid-properties inside
 * Also includes the folder's own page.mdx file (e.g., system-design/page.mdx) in the folder
 */
export function groupPostsByFolder(posts: Post[]): PostGroup[] {
  const groups: PostGroup[] = [];
  const folderMap = new Map<string, PostGroup>();
  const folderIndexPosts = new Map<string, Post>(); // Track folder's own page.mdx files

  // First pass: identify folder index posts and nested posts
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString();
    const pathParts = post.path.split('/');
    
    if (pathParts.length === 1) {
      // Check if this is a folder index (has nested posts with same name)
      const hasNestedPosts = posts.some(p => 
        p.path.startsWith(`${post.path}/`) && p.path !== post.path
      );
      
      if (hasNestedPosts) {
        // This is a folder index post
        folderIndexPosts.set(`${year}/${post.path}`, post);
      } else {
        // Direct post, no nested folder
        groups.push({
          type: 'post',
          name: post.title,
          path: post.path,
          year,
          post,
        });
      }
    } else {
      // Nested folder structure
      const folderName = pathParts[0];
      const folderKey = `${year}/${folderName}`;
      
      if (!folderMap.has(folderKey)) {
        // Create folder group
        const folderGroup: PostGroup = {
          type: 'folder',
          name: folderName,
          path: folderName,
          year,
          children: [],
        };
        folderMap.set(folderKey, folderGroup);
        groups.push(folderGroup);
      }
      
      const folder = folderMap.get(folderKey)!;
      
      if (pathParts.length === 2) {
        // Post inside folder
        folder.children!.push({
          type: 'post',
          name: post.title,
          path: post.path,
          year,
          post,
        });
      } else {
        // Deeper nesting (not currently supported, but handle gracefully)
        folder.children!.push({
          type: 'post',
          name: post.title,
          path: post.path,
          year,
          post,
        });
      }
    }
  });

  // Second pass: add folder index posts to their folders
  folderIndexPosts.forEach((indexPost, folderKey) => {
    const folder = folderMap.get(folderKey);
    if (folder && folder.children) {
      // Add index post at the beginning of children
      folder.children.unshift({
        type: 'post',
        name: indexPost.title,
        path: indexPost.path,
        year: new Date(indexPost.date).getFullYear().toString(),
        post: indexPost,
      });
    }
  });

  // Sort folders and their children
  groups.forEach((group) => {
    if (group.type === 'folder' && group.children) {
      group.children.sort((a, b) => {
        if (a.post && b.post) {
          return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
        }
        return 0;
      });
    }
  });

  return groups;
}

