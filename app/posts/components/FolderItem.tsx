"use client";

import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import type { PostGroup } from "../utils/postGrouping";
import Link from "next/link";

interface FolderItemProps {
  group: PostGroup;
  year: string;
  isFirstOfYear: boolean;
  isLastOfYear: boolean;
  onFolderClick?: (group: PostGroup) => void;
}

export function FolderItem({ group, year, isFirstOfYear, isLastOfYear, onFolderClick }: FolderItemProps) {
  if (group.type === 'post' && group.post) {
    // Regular post item
    return (
      <li>
        <Link
          href={`/${year}/${group.path}`}
          title={`Read ${group.name} - ${group.post.minuteToRead} minute read`}
          prefetch={false}
          scroll={true}
        >
          <span
            className={`flex px-2 transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
              ${!isFirstOfYear ? "border-t-0" : ""}
              ${isLastOfYear ? "border-b-0" : ""}
            `}
          >
            <div className={`py-2 flex grow items-center ${!isFirstOfYear ? "ml-14" : ""}`}>
              {isFirstOfYear && (
                <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">
                  {year}
                </span>
              )}
              
              <div className="flex flex-col grow items-start">
                <div>
                  <span className="dark:text-gray-100 font-semibold">{group.name}</span>
                  &nbsp;|&nbsp;
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {group.post.minuteToRead} mins
                  </span>
                </div>
                
                <div>
                  <Badge className="mr-2">{group.post.category}</Badge>
                  <span className="text-xs">{group.post.date}</span>
                </div>
              </div>
            </div>
          </span>
        </Link>
      </li>
    );
  }

  // Folder item - clickable to navigate into folder
  // Style it like a post item but with folder icon
  const hasChildren = group.children && group.children.length > 0;
  const folderDisplayName = group.name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Get folder metadata from first child or use defaults
  const firstChild = hasChildren ? group.children![0] : null;
  const folderCategory = firstChild?.post?.category || 'Technical';
  const folderDate = firstChild?.post?.date || '';
  const totalMins = hasChildren 
    ? group.children!.reduce((sum, child) => sum + (child.post?.minuteToRead || 0), 0)
    : 0;

  return (
    <li>
      <button
        onClick={() => {
          if (hasChildren && onFolderClick) {
            onFolderClick(group);
          }
        }}
        disabled={!hasChildren}
        className={`w-full flex px-2 transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
          ${!isFirstOfYear ? "border-t-0" : ""}
          ${isLastOfYear ? "border-b-0" : ""}
          ${!hasChildren ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div className={`py-2 flex grow items-center ${!isFirstOfYear ? "ml-14" : ""}`}>
          {isFirstOfYear && (
            <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">
              {year}
            </span>
          )}
          
          <div className="flex flex-col grow items-start">
            <div>
              <Folder className="w-4 h-4 inline-block mr-2 text-gray-500 align-middle" />
              <span className="dark:text-gray-100 font-semibold">{folderDisplayName}</span>
              &nbsp;|&nbsp;
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {hasChildren ? `${group.children!.length} items` : '0 items'}
              </span>
            </div>
            
            <div>
              <Badge className="mr-2">{folderCategory}</Badge>
              <span className="text-xs">{folderDate || 'Folder'}</span>
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
