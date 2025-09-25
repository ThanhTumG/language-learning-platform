import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export const Navbar = () => {
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

      <div className="flex items-center h-[60%]">
        <Button className="h-full font-medium text-base">
          <Link href={"/sign-in"}>Learn now</Link>
        </Button>
      </div>
    </nav>
  );
};
