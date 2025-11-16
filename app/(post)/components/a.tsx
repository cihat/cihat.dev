import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  title?: string;
  id?: string;
  [key: string]: any;
}

// Extract domain from URL
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function A({ children, className = "", href, title, ...props }: AProps) {
  if (href[0] === "#") {
    // Internal anchor link
    return (
      <a
        href={href}
        className={`post-link-internal border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white ${className}`}
        title={title}
        {...props}
      >
        {children}
      </a>
    );
  } else {
    // External link
    const domain = getDomain(href);
    const displayTitle = title || `${domain} - Opens in new tab`;
    
    return (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        className={`post-link-external group inline-flex items-center gap-1.5 border-b text-gray-600 border-gray-300 transition-all hover:border-gray-600 hover:text-gray-800 dark:text-white dark:border-gray-500 dark:hover:border-white dark:hover:text-gray-200 ${className}`}
        title={displayTitle}
        {...props}
      >
        <span>{children}</span>
        <span className="post-link-domain text-xs text-gray-400 dark:text-gray-500 opacity-50 group-hover:opacity-100 transition-opacity font-mono ml-0.5">
          ({domain})
        </span>
        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-0.5" />
      </Link>
    );
  }
}
