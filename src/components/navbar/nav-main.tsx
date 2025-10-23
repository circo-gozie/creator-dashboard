"use client";

import { type LucideIcon } from "lucide-react";

import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import NavBarButton from "./nav-bar-button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavBarButton key={item.title} {...item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
