import Link from "next/link";

interface AProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  title?: string;
  id?: string;
  [key: string]: any;
}

export function A({ children, className = "", href, title, ...props }: AProps) {
  if (href[0] === "#") {
    return (
      <a
        href={href}
        className={`border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white ${className}`}
        title={title}
        {...props}
      >
        {children}
      </a>
    );
  } else {
    return (
      <Link
        target="_blank"
        href={href}
        className={`border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white ${className}`}
        title={title || `Visit ${href} - Opens in new tab`}
        {...props}
      >
        {children}
      </Link>
    );
  }
}
