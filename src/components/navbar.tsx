"use client";

import { BookOpen, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "text-lg",
        isActive && "bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/dashboard", children: "Dashboard" },
  { href: "/test-practices", children: "Test Practices" },
  { href: "/overall", children: "Overall" },
];

export const Navbar = () => {
  const pathName = usePathname();

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="border-b h-20 flex items-center justify-between lg:px-12 px-4 bg-white w-full">
      <Link href={"/"} className="flex items-center gap-2 text-blue-600/90">
        <BookOpen className="h-10 w-10 " />
        <span
          className={cn(
            "text-3xl font-semibold tracking-wider",
            poppins.className
          )}
        >
          LangHub
        </span>
      </Link>

      {session.data?.user && (
        <div className="hidden items-center h-[60%] md:flex gap-4">
          {navbarItems.map((item) => (
            <NavbarItem
              key={item.href}
              href={item.href}
              isActive={pathName === item.href}
            >
              {item.children}
            </NavbarItem>
          ))}
        </div>
      )}

      <div className="flex items-center h-[60%]">
        {session.data?.user ? (
          <Button
            variant="ghost"
            className="rounded-full h-12 w-12 flex items-center"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        ) : (
          <Button className="h-full font-medium text-base">
            <Link prefetch href={"/sign-in"}>
              Learn now
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
