"use client";

import * as React from "react";
import {
  Frame,
  Map,
  PieChart,
  House,
  Video,
  ChartLine,
  Banknote,
  ScrollText,
  Clapperboard,
  Settings,
  BookMarked,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { NavMain } from "@/components/navbar/nav-main";
import { LatestContents } from "@/components/navbar/latest-contents";
import { SideBarHeaderMain } from "@/components/navbar/sidebar-header-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: House,
      isActive: true,
    },
    {
      title: "Content",
      url: "#",
      icon: Video,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartLine,
    },
    {
      title: "Monetizaition",
      url: "#",
      icon: Banknote,
    },
    {
      title: "Content Policy",
      url: "#",
      icon: ScrollText,
    },

    {
      title: "Studio customization",
      url: "#",
      icon: Clapperboard,
    },
    {
      title: "Settings & Team",
      url: "#",
      icon: Settings,
    },
    {
      title: "Learning and growth",
      url: "#",
      icon: BookMarked,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <SideBarHeaderMain />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <Separator className="!w-9/10 mx-auto" />
        <LatestContents projects={data.projects} />
      </SidebarContent>
    </Sidebar>
  );
}
