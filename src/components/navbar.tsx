"use client";

import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children }: NavbarItemProps) => {
  return (
    <Button variant="ghost" className="text-base hover:bg-blue-200">
      <Link prefetch href={href}>
        {children}
      </Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/dashboard", children: "Dashboard" },
  { href: "/test-practices/toeic", children: "Test Practices" },
  { href: "/exams", children: "Exams" },
];

export const Navbar = () => {
  const pathName = usePathname();

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  const router = useRouter();
  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: () => {
        router.push("/sign-in");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <nav className="border-b h-20 flex items-center justify-between lg:px-12 px-4 bg-white w-full">
      <Link href={"/"} className="flex items-center gap-2 text-blue-600/90">
        <BookOpen className="h-10 w-10 " />
        <div>
          <span
            className={cn(
              "text-2xl font-semibold tracking-wider",
              poppins.className
            )}
          >
            LangHub
          </span>
          <p className="text-xs text-gray-500">
            Master Language Certifications
          </p>
        </div>
      </Link>

      <div className="flex items-center h-[60%] gap-10">
        {session.data?.user && (
          <div className="hidden md:flex gap-3">
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

        {session.data?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border-0 bg-transparent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Avatar className="h-10 w-10 cursor-pointer">
                {(() => {
                  const avatar = session.data?.user?.avatar;
                  const avatarUrl =
                    avatar && typeof avatar === "object" && "url" in avatar
                      ? avatar.url ?? undefined
                      : undefined;
                  return (
                    <AvatarImage
                      src={avatarUrl}
                      alt={session.data.user.fullname}
                    />
                  );
                })()}
                <AvatarFallback>
                  {session.data.user.fullname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{session.data.user.fullname}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {session.data.user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {session.data.user.roles &&
              (session.data.user.roles.includes("super-admin") ||
                session.data.user.roles.includes("business")) ? (
                <DropdownMenuItem onClick={() => router.push("/admin")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Progress
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
