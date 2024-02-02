import { LinkHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface NavLinkProps extends LinkHTMLAttributes<HTMLElement> {
  children: ReactNode;
  disabled?: boolean;
}

export const NavLink = ({
  children,
  href,
  disabled,
  ...props
}: NavLinkProps) => {
  return (
    <Link
      href={href!}
      className={`w-full h-full flex items-center p-2 gap-2 ${
        disabled && "cursor-not-allowed"
      }`}
      {...props}
    >
      {children}
    </Link>
  );
};
