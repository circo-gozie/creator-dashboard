import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function OverviewFeedToggle() {
  return (
    <ToggleGroup type="single" spacing={2} size="sm">
      <ToggleGroupItem
        value="overview"
        aria-label="Toggle star"
        className="data-[state=on]:bg-foreground bg-accent hover:bg-accent hover:text-foreground"
      >
        Overview
      </ToggleGroupItem>
      <ToggleGroupItem
        value="feed"
        aria-label="Toggle heart"
        className="data-[state=on]:bg-foreground bg-accent hover:bg-accent hover:text-foreground"
      >
        Feeds
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
