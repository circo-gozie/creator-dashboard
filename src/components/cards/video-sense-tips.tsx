import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";
import { Sparkles } from "lucide-react";

const VideoSenseTips = () => {
  return (
    <Card className="group">
      <CardHeader>
        <CardTitle>
          {" "}
          <Title title="Video sense Tips" />
        </CardTitle>
        <CardDescription className="sr-only">video sense tips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full inline-flex gap-2">
          <div className="size-6 pt-2">
            <Sparkles className="size-3.5 " />
          </div>
          <div className="grow">
            <p className="basis-auto w-full wrap-anywhere overflow-hidden">
              AI suggestions now available for video editing. So please who and
              who is interested? Shout-out to you for the solid challenge and
              well done to all teams for giving it your best! 👏 Big
              congratulations you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoSenseTips;
