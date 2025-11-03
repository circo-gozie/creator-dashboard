import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { statsProp } from "./stats";
import Title from "./title";
import Stats from "./stats";
import { Separator } from "../ui/separator";

type statCardProps = {
  title: string;
  stats: statsProp[];
};

const StatCard = (props: statCardProps) => {
  const { title, stats } = props;
  const stat1 = stats[0];
  const stat2 = stats[1];
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {" "}
          <Title title={title} />
        </CardTitle>
        <CardDescription className="sr-only">{title}</CardDescription>
      </CardHeader>
      <CardContent className="inline-flex w-full justify-between">
        <Stats
          value={stat1.value}
          label={stat1.label}
          percentageChange={stat1.percentageChange}
          bullish={stat1.bullish}
        />

        {stat2 && (
          <Separator orientation="vertical" className="bg-muted-foreground" />
        )}

        {stat2 && (
          <Stats
            value={stat2.value}
            label={stat2.label}
            percentageChange={stat2.percentageChange}
            bullish={stat2.bullish}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
