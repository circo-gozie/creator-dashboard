"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "../ui/button";

export function SideBarHeaderMain() {
  return (
    <SidebarMenu className="h-16">
      <SidebarMenuItem className="flex ps-4 items-center h-full gap-2">
        <Button variant="ghost" className="!p-0 h-8">
          <Menu className="mt-1 size-4" />
        </Button>
        <div className="h-8 relative aspect-5/1">
          <Image src={"/circo-studio.svg"} alt={"circo studio"} fill />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
