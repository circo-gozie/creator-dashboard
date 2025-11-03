import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";

type Comment = {
  id: string;
  content: string;
  videoTitle: string;
  likes: string;
  videoThumbnail: string;
};

type RevenueProps = {
  comments: Comment[];
};

const LatestComments = ({ comments }: RevenueProps) => {
  return (
    <Card className="group border-0 h-fit">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between">
          <Title title="Latest comments" />
        </CardTitle>
        <CardDescription className="sr-only">
          Latest video comments
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="w-full space-y-1 pb-3 border-b border-muted/30 last:border-none"
          >
            {/* Comment + Thumbnail */}
            <div className="inline-flex w-full gap-2 items-start">
              <div className="space-y-2">
                <p className="flex-1 line-clamp-2 text-xs">{comment.content}</p>
                {/* Likes + Video title */}
              </div>

              <div className="relative h-9 aspect-3/2 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={comment.videoThumbnail}
                  alt={comment.videoTitle}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex items-center  gap-2 text-xs ">
              <p className="truncate font-bold">{comment.videoTitle}</p>
              <div className="inline-flex items-center gap-1">
                <ThumbsUp className="stroke-muted opacity-70 size-4" />
                <span>{comment.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LatestComments;
