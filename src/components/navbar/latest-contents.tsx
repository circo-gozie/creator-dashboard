"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

export function LatestContents({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
      <SidebarGroupLabel className="text-foreground px-0">
        Latest contents
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <div
            key={item.name}
            className="inline-flex mt-2 gap-2 w-full cursor-pointer"
          >
            <div className="size-7 aspect-square rounded-sm bg-accent"></div>
            <p className="text-sm overflow-hidden overflow-ellipsis h-fit mt-auto pb-0.5 line-clamp-1">
              {" "}
              {item.name} Lorem, ipsum dolor sit
            </p>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
