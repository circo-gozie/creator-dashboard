import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";
import { Eye, MessageCircleMore, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { Video } from "@/lib/types";

type TopVideoProps = {
  videos: Video[];
};

const TopVideos = ({ videos }: TopVideoProps) => {
  return (
    <Card className="group border-0 h-fit">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between">
          <Title title="Top Videos" />
        </CardTitle>
        <CardDescription className="sr-only">
          Top performing videos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-full space-y-2 pb-3 border-b border-muted/30 last:border-none"
          >
            {/* Thumbnail + Title */}
            <div className="inline-flex w-full gap-3 items-start">
              <div className="flex-1 space-y-1">
                <p className="line-clamp-2 text-sm font-medium">
                  {video.title}
                </p>
                {/* Metrics */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="inline-flex items-center gap-1">
                    <Eye className="stroke-muted opacity-70 size-4" />
                    <p>{video.views}</p>
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <MessageCircleMore className="stroke-muted opacity-70 size-4" />
                    <p>{video.comments}</p>
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <ThumbsUp className="stroke-muted opacity-70 size-4" />
                    <p>{video.likes}</p>
                  </div>
                </div>
              </div>

              <div className="relative h-10 aspect-[3/2] flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopVideos;
