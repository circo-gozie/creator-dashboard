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
import StatCard from "@/components/cards/stat-card";
import LatestVideoPerformance from "@/components/cards/latest-video-performance";
import VideoSenseTips from "@/components/cards/video-sense-tips";
import RevenueSummary from "@/components/cards/revenue-summary";
import LatestComments from "@/components/cards/latest-comments";
import {
  latestComments,
  latestVideos,
  dummyUpdates,
  dummyIssues,
} from "@/lib/dummyData";
import TopVideos from "@/components/cards/top-videos";
import IssuesUpdates from "@/components/cards/issues-updates";
import InnerCirco from "@/components/cards/inner-circo";
import { VideoDistributionChart } from "@/components/cards/view-distribution-chart";

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
              <Button variant="muted">
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
                <div className="fade_in w-full  basis-full rounded-lg col-span-3">
                  <StatCard
                    title={"Traffic"}
                    stats={[
                      {
                        value: "24.5K",
                        label: "impressions",
                        percentageChange: "4.5",
                        bullish: true,
                      },
                      {
                        value: "24.5K",
                        label: "Click-Through Rate",
                        percentageChange: "4.5",
                        bullish: true,
                      },
                    ]}
                  />
                </div>
                <div className="fade_in  md:w-full rounded-lg grow col-span-2">
                  <StatCard
                    title={"Views"}
                    stats={[
                      {
                        value: "240.5K",
                        label: "Total number of views",
                        percentageChange: "45",
                        bullish: true,
                      },
                    ]}
                  />
                </div>
                <div className="fade_in  md:w-full rounded-lg grow col-span-2">
                  <StatCard
                    title={"Members"}
                    stats={[
                      {
                        value: "2.5K",
                        label: "Total number of views",
                        percentageChange: "0.5",
                        bullish: false,
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="fade_in bg-secondary w-full aspect-auto md:min-h-min">
                <VideoDistributionChart />
              </div>

              <div className="w-full grid gap-4 md:grid-cols-5">
                <div className="fade_in w-full max-w-full  rounded-lg  md:col-span-3">
                  <LatestVideoPerformance
                    title={"Latest video performance"}
                    stats={{
                      impressions: "498k",
                      views: "300k",
                      comments: "106",
                      likes: "59k",
                    }}
                    video={{
                      title: "How to grow your social",
                      thumbnail:
                        "https://cdn.pixabay.com/photo/2017/10/20/10/58/elephant-2870777_1280.jpg",
                      timeDelta: "4 days ago",
                    }}
                  />
                </div>
                <div className="fade_in w-full  rounded-lg  md:col-span-2">
                  <VideoSenseTips />
                </div>
              </div>

              <div className="w-full grid gap-4 md:grid-cols-3">
                <div className="fade_in w-full  h-fit rounded-lg sm:aspect-7/3">
                  <IssuesUpdates items={dummyIssues} flag={"issues"} />
                </div>
                <div className="fade_in w-full  h-fit rounded-lg ">
                  <IssuesUpdates items={dummyUpdates} flag={"updates"} />
                </div>{" "}
                <div className="fade_in w-full h-fit  rounded-lg ">
                  <InnerCirco />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:basis-2/7 space-y-4">
              <div className="fade_in w-full bg-secondary rounded-lg">
                <RevenueSummary
                  total={"1,228,000"}
                  month={"145,000"}
                  year={"467,000"}
                />
              </div>
              <div className="fade_in w-full  rounded-lg ">
                <LatestComments comments={latestComments} />
              </div>
              <div className="fade_in w-full  rounded-lg">
                <TopVideos videos={latestVideos} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
