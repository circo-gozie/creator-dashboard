import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Title from "./title";

type IssuesUpdatesProps = {
  items: string[];
  flag: "issues" | "updates";
};

const IssuesUpdates = (props: IssuesUpdatesProps) => {
  const { items, flag } = props;
  return (
    <Card className="group border-0 h-fit">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between">
          <Title title={flag === "issues" ? "Issues" : "Updates"} />
        </CardTitle>
        <CardDescription className="sr-only">
          Latest video comments
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-4">
          {items.map((comment, index) => (
            <li
              key={index}
              className="leading-5 inline-flex gap-1 items-center"
            >
              {" "}
              <figure className="size-1.5 p-0.5 border-[0.5px] border-muted rounded-full bg-secondary self-start mt-2"></figure>
              <p>{comment}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default IssuesUpdates;
