import Link from "next/link";

type AElementType = {
  children?: React.ReactNode,
  className?: string,
  href: string,
  target: string,
  title?: string
}

export default function A({ children, className = "", href, title, ...props }: AElementType) {
  if (!href) {
    return (
      <a
        href={'https://github.com/cihat/learning'}
        className={`border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white ${className}`}
        title={title || "Visit Cihat Salik's Learning Repository on GitHub"}
        {...props}
      >
        {children}
      </a>
    );
  } else {
    return (
      <Link
        href={href}
        className={`border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white ${className}`}
        title={title}
        {...props}
      >
        {children}
      </Link>
    );
  }
}
