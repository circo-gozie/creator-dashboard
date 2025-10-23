"use client";
import { OverviewFeedToggle } from "@/components/buttons/overview-feed-toggle";
import HeaderSearch from "@/components/inputs/HeaderSearch";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import { NavUser } from "@/components/navbar/nav-user";
import Notification from "@/components/navbar/notification";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Page() {
  useGSAP(() => {
    // Animate all fade_in elements
    gsap.fromTo(
      ".fade_in",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: {
          each: 0.05, // base delay between elements
          from: "random", // randomize the order
        },
        ease: "power3.out",
      }
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex p-2 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="h-16 flex justify-between items-center px-4 w-full">
            <HeaderSearch />
            <div className="flex items-center gap-4">
              <Button variant="muted" className="bg-accent">
                <Plus />
                Create Post
              </Button>
              <Notification />
              <NavUser
                user={{
                  name: "james",
                  email: "x@circo.live",
                  avatar: "JA",
                }}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="w-full p-4 flex justify-center">
            <OverviewFeedToggle />
          </div>

          <div className="w-full h-full flex flex-col md:flex-row gap-4">
            {/* LEFT COLUMN */}
            <div className="md:basis-5/7 space-y-4">
              <div className="space-y-0 flex flex-wrap md:grid grid-cols-7 gap-4">
                <div className="fade_in bg-accent w-full aspect-8/3 basis-full rounded-lg col-span-3" />
                <div className="fade_in bg-accent md:w-full aspect-8/3 md:aspect-auto rounded-lg grow col-span-2" />
                <div className="fade_in bg-accent md:w-full aspect-8/3 md:aspect-auto rounded-lg grow col-span-2" />
              </div>

              <div className="fade_in bg-secondary aspect-9/4 w-full rounded-xl md:min-h-min" />

              <div className="w-full grid gap-4 md:grid-cols-5">
                <div className="fade_in w-full bg-accent rounded-lg aspect-7/3 md:col-span-3" />
                <div className="fade_in w-full bg-accent rounded-lg aspect-video md:aspect-auto md:col-span-2" />
              </div>

              <div className="w-full grid gap-4 md:grid-cols-3">
                <div className="fade_in w-full bg-accent h-44 rounded-lg aspect-7/3" />
                <div className="fade_in w-full bg-accent h-64 rounded-lg aspect-video md:aspect-auto" />
                <div className="fade_in w-full bg-accent h-74 rounded-lg aspect-video md:aspect-auto" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:basis-2/7 space-y-4">
              <div className="fade_in w-full bg-secondary rounded-lg aspect-square" />
              <div className="fade_in w-full bg-accent rounded-lg aspect-9/10" />
              <div className="fade_in w-full bg-accent rounded-lg aspect-7/10" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
