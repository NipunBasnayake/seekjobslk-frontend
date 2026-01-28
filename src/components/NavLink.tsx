"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NavLinkCompatProps {
  href: string;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  children: ReactNode;
}

const NavLink = ({
  href,
  className,
  activeClassName,
  exact = true,
  children,
  ...props
}: NavLinkCompatProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
};

export { NavLink };
