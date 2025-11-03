import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";
import { Button } from "../ui/button";
import {
  ChartLine,
  ChevronRight,
  Eye,
  MessageCircleMore,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type VidPerformance = {
  impressions: string;
  views: string;
  comments: string;
  likes: string;
};

type VideoDetail = {
  title: string;
  thumbnail: string;
  timeDelta: string;
};

type latestVidPerformanceProps = {
  title: string;
  video: VideoDetail;
  stats: VidPerformance;
};

const LatestVideoPerformance = (props: latestVidPerformanceProps) => {
  const { title, stats, video } = props;
  return (
    <Card className="group">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between group">
          {" "}
          <Title title={title} />{" "}
          <Button
            variant={"icon"}
            className="bg-secondary size-8 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <ChevronRight />
          </Button>
        </CardTitle>
        <CardDescription className="sr-only">{title}</CardDescription>
      </CardHeader>
      <CardContent className="flex max-sm:flex-wrap w-full gap-3 justify-between">
        <div className="w-full sm:w-2/3 space-y-2">
          <div className="relative w-full aspect-4/2 overflow-hidden">
            <Image
              alt={video.title}
              fill
              src={video.thumbnail}
              className="object-cover rounded-[0.3rem]"
            />
            <div className="absolute bottom-0 p-2 flex w-full z-10 justify-between bg-gradient-to-t from-black/80 via-black/70 to-black/0 rounded-b-[0.3rem] ">
              <p className="text-sm invert-10 ">{video.title}</p>
              <p className="text-xs opacity-70 invert-20 text-shadow-accent-foreground">
                {video.timeDelta}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs ">
            <div className="inline-flex items-center gap-0.5">
              <ChartLine className="stroke-muted opacity-70  size-4" />{" "}
              <p className="text-xs ">{stats.impressions}</p>
            </div>
            <div className="inline-flex items-center gap-0.5">
              <Eye className="stroke-muted size- opacity-70 size-4" />{" "}
              <p className="text-xs ">{stats.views}</p>
            </div>
            <div className="inline-flex items-center gap-0.5">
              <MessageCircleMore className="opacity-70 ke-muted size-4" />{" "}
              <p className="text-xs ">{stats.comments}</p>
            </div>
            <div className="inline-flex items-center gap-0.5">
              <ThumbsUp className="stroke-muted  opacity-70 size-4" />{" "}
              <p className="text-xs ">{stats.likes}</p>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/3 min-h-full space-y-2 bg-secondary p-2 px-2.5 rounded">
          <p className="flex gap-1 items-center text-sm">
            <Sparkles className="size-3.5 stroke-muted-foreground" /> Video
            sense
          </p>

          <p className="text-xs text-foreground/70">
            Your video is gaining popularity with your fans. To get even more
            popular{" "}
            <Link
              href={"#"}
              target="blank"
              className="font-semibold underline underline-offset-2 text-foreground"
            >
              promote it to the rest of the world.
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestVideoPerformance;
