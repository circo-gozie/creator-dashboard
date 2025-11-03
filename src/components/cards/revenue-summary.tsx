import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type revenueProps = {
  total: string;
  month: string;
  year: string;
};

const RevenueSummary = (props: revenueProps) => {
  const { total, month } = props;
  return (
    <Card className="group border-0 h-fit">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between group">
          {" "}
          <Title title="Revenue Summary" />{" "}
          <Button
            variant={"icon"}
            className="bg-accent size-8 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <ChevronRight />
          </Button>
        </CardTitle>
        <CardDescription className="sr-only">Revenue summary</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-accent text-center py-8 space-y-2 rounded">
          <p className="text-lg sm:text-4xl font-medium">${total}</p>
          <p className="text-xs sm:text-sm opacity-70">Total amount earned</p>
        </div>
        <div className="inline-flex w-full justify-between opacity-80">
          <div className="w-full text-center">
            <p className="inline-flex items-center gap-1 font-medium">
              {month}{" "}
            </p>
            <p className="text-xs opacity-70">Last 30 days</p>
          </div>
          <Separator orientation="vertical" className="bg-muted-foreground" />

          <div className="w-full text-center">
            <p className="inline-flex items-center gap-1 font-medium">
              {month}{" "}
            </p>
            <p className="text-xs opacity-70">Last 30 days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSummary;
