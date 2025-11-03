import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";
import Image from "next/image";

const InnerCirco = () => {
  return (
    <Card className="group border-0 h-fit">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between">
          <Title title="Inner Circo" />
        </CardTitle>
        <CardDescription className="sr-only">
          Latest video comments
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="w-full relative aspect-video rounded">
          <Image
            src={
              "https://cdn.pixabay.com/photo/2016/01/07/13/32/new-years-eve-1125786_1280.jpg"
            }
            fill
            alt="this week on Circo"
            className="object-cover rounded"
          />
        </div>
        <div className="space-y-2">
          <p className="font-medium text-lg">This week on Circo</p>
          <p className=" line-clamp-4 text-xs opacity-70 overflow-ellipsis">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero nemo
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero nemo
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero nemo
            facere excepturi qui minus at!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InnerCirco;
