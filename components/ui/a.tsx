import Link from "next/link";

type AElementType = {
  children?: React.ReactNode,
  className?: string,
  href: string,
  target: string
}

export default function A({ children, className = "", href, ...props }: AElementType) {
  console.log('href', href)
  if (!href) {
    return (
      <a
        href={'https://github.com/cihat/learning'}
        className={`border-b text-gray-600 border-gray-300 transition-[border-color] hover:border-gray-600 dark:text-white dark:border-gray-500 dark:hover:border-white ${className}`}
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
        {...props}
      >
        {children}
      </Link>
    );
  }
}
