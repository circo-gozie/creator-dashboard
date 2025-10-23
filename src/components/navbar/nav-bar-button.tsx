import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

type NavBarBtnProps = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
};

const NavBarButton = ({ title, url, icon: Icon, isActive }: NavBarBtnProps) => {
  return (
    <Link
      href={url}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 group rounded-md transition-colors",
        isActive
          ? "bg-accent font-semibold has-[svg]:stroke-2 border-s border-primary"
          : "hover:bg-accent"
      )}
    >
      <Icon className="w-4 h-4 transition-all" />

      <span>{title}</span>
    </Link>
  );
};

export default NavBarButton;
