"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Post } from "@/types";
import { getYear } from "@/lib/utils";
import { groupPostsByFolder, type PostGroup } from "../utils/postGrouping";
import { FolderItem } from "./FolderItem";
import { ArrowLeft } from "lucide-react";

interface PostListProps {
  posts: Post[];
}

/**
 * Renders a list of blog posts grouped by year and folder structure
 * Supports navigation into folders (Finder-like)
 */
export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [navigationStack, setNavigationStack] = useState<PostGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<PostGroup | null>(null);

  // Restore folder state from URL params or sessionStorage
  // Only restore if recently saved (within last 10 seconds) to prevent unwanted folder opening
  useEffect(() => {
    // Only restore if we don't already have a currentGroup set (user-initiated navigation)
    if (currentGroup) return;

    const restoreFolder = (year: string, folderName: string) => {
      const yearPosts = posts.filter(post => getYear(post.date).toString() === year);
      const groupedPosts = groupPostsByFolder(yearPosts);
      const folderGroup = groupedPosts.find(
        group => group.type === 'folder' && group.name === folderName
      );
      
      if (folderGroup && folderGroup.type === 'folder') {
        setCurrentGroup(folderGroup);
        return true;
      }
      return false;
    };

    const folderParam = searchParams.get('folder');
    if (folderParam) {
      // Parse folder path: "year/folderName"
      const [year, folderName] = folderParam.split('/');
      if (year && folderName && restoreFolder(year, folderName)) {
        // Remove folder param from URL after restoring state
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('folder');
        const newUrl = newSearchParams.toString() 
          ? `${window.location.pathname}?${newSearchParams.toString()}`
          : window.location.pathname;
        router.replace(newUrl, { scroll: false });
      }
    } else {
      // Try sessionStorage - only restore if saved within last 10 seconds
      // This ensures we only restore when coming back from a post detail page
      const savedFolder = typeof window !== 'undefined' ? sessionStorage.getItem('postListFolder') : null;
      if (savedFolder) {
        try {
          const data = JSON.parse(savedFolder);
          const { year, folderName, timestamp } = data;
          
          // Only restore if saved within last 10 seconds (prevents stale data)
          const isRecent = timestamp && (Date.now() - timestamp) < 10000;
          
          if (isRecent && year && folderName && restoreFolder(year, folderName)) {
            sessionStorage.removeItem('postListFolder');
          } else {
            // Remove stale or invalid data
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('postListFolder');
            }
          }
        } catch (e) {
          // Invalid saved data, ignore
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('postListFolder');
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, posts]);

  if (!posts.length) {
    return (
      <p className="flex justify-center items-center text-center text-xl mt-12 font-semibold">
        Not found
      </p>
    );
  }

  // Group posts by year first
  const postsByYear = new Map<string, Post[]>();
  posts.forEach((post) => {
    const year = getYear(post.date).toString();
    if (!postsByYear.has(year)) {
      postsByYear.set(year, []);
    }
    postsByYear.get(year)!.push(post);
  });

  // Sort years descending
  const sortedYears = Array.from(postsByYear.keys()).sort((a, b) => parseInt(b) - parseInt(a));

  // If we're inside a folder, show its contents
  if (currentGroup && currentGroup.type === 'folder' && currentGroup.children) {
    const year = currentGroup.year;
    const folderDisplayName = currentGroup.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
      <div>
        {/* Breadcrumb/Back button */}
        <button
          onClick={() => {
            if (navigationStack.length > 0) {
              const previousGroup = navigationStack[navigationStack.length - 1];
              setNavigationStack(navigationStack.slice(0, -1));
              setCurrentGroup(previousGroup);
            } else {
              setCurrentGroup(null);
              setNavigationStack([]);
            }
          }}
          className="w-full flex items-center px-2 py-2 mb-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#242424] transition-colors border-b border-gray-200 dark:border-[#313131]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back</span>
          {navigationStack.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({navigationStack.map(g => g.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' / ')})
            </span>
          )}
        </button>

        {/* Folder name */}
        <div className="px-2 py-1 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {folderDisplayName}
        </div>

        {/* Folder contents */}
        <ul>
          {currentGroup.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === currentGroup.children!.length - 1;

            return (
              <FolderItem
                key={child.path}
                group={child}
                year={year}
                isFirstOfYear={isFirst}
                isLastOfYear={isLast}
                parentFolder={currentGroup}
                onFolderClick={(group) => {
                  setNavigationStack([...navigationStack, currentGroup]);
                  setCurrentGroup(group);
                }}
              />
            );
          })}
        </ul>
      </div>
    );
  }

  // Main list view
  return (
    <ul>
      {sortedYears.map((year, yearIndex) => {
        const yearPosts = postsByYear.get(year)!;
        const groupedPosts = groupPostsByFolder(yearPosts);
        const isLastYear = yearIndex === sortedYears.length - 1;

        return (
          <React.Fragment key={year}>
            {groupedPosts.map((group, groupIndex) => {
              const isFirstOfYear = groupIndex === 0;
              const isLastOfYear = groupIndex === groupedPosts.length - 1 && isLastYear;

              return (
                <FolderItem
                  key={`${year}-${group.path}`}
                  group={group}
                  year={year}
                  isFirstOfYear={isFirstOfYear}
                  isLastOfYear={isLastOfYear}
                  onFolderClick={(group) => {
                    setCurrentGroup(group);
                  }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </ul>
  );
}
