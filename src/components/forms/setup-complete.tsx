import Link from "next/link";
import { Button } from "../ui/button";
import { RadioReceiver, Upload } from "lucide-react";

const SetupComplete = () => {
  return (
    <div className="size-full  flex text-background items-center justify-center p-4">
      <div className="w-md text-center space-y-4">
        <p className="text-4xl font-semibold bg-gradient-to-r from-primary to-primary-200 bg-clip-text text-transparent">
          Studio Ready!
        </p>
        <p className="text-foreground">
          Your audience can now discover you, <br /> watch your content and
          connect with your story
        </p>

        <Button
          className="w-full text-foreground"
          size="lg"
          variant={"secondary"}
        >
          <RadioReceiver />
          <Link href="/">
            <p>Record your introduction</p>
          </Link>
        </Button>
        <Button
          className="w-full border-2 !border-border text-foreground hover:text-foreground/60 hover:bg-transparent"
          size="lg"
          variant="outline"
        >
          <Upload />
          <Link href="/">
            <p>Share your first Drop or Video</p>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SetupComplete;
