import cx from "@/lib/cx";
import { ReactNode } from "react";

type BaseLinkProps = {
  href: string;
  children?: ReactNode;
  blank?: boolean;
  className?: string;
  title?: string;
};

export default function BaseLink({
  children,
  href,
  blank = true,
  className,
  title,
  ...props
}: BaseLinkProps) {
  const isBlank = blank
    ? {
        rel: "noopener noreferrer",
        target: "_blank",
      }
    : {};

  return (
    <a href={href} className={cx(className)} title={title} {...isBlank} {...props}>
      {children}
    </a>
  );
}


