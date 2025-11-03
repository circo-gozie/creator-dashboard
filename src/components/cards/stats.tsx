import { Triangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type statsProp = {
  value: string;
  label: string;
  percentageChange: string;
  bullish: boolean;
};
const Stats = (props: statsProp) => {
  const { value, label, percentageChange, bullish } = props;
  return (
    <div className="">
      <p className="inline-flex items-center gap-1 font-medium">
        {value} ({" "}
        <span>
          <Triangle
            className={cn(
              "size-3 stroke-0",
              bullish ? "fill-success" : "rotate-180 fill-primary"
            )}
          />
        </span>{" "}
        {percentageChange}% )
      </p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
};

export default Stats;
