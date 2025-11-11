import {
  Sparkles,
  Users,
  Music2,
  UtensilsCrossed,
  Cpu,
  Plane,
  Palette,
  EyeOff,
  Coins,
  Briefcase,
  Dumbbell,
  Landmark,
  Mic,
  Laugh,
  Coffee,
  HeartHandshake,
  Newspaper,
  Film,
  Gamepad2,
  Shirt,
  Heart,
  GraduationCap,
  Car,
  Home,
  Baby,
  PawPrint,
  Hammer,
  Camera,
  Microscope,
  BookOpen,
  Church,
  HandHeart,
  LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type CategoryButtonProps = {
  category: string;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
};

// Map categories to their corresponding icons
const categoryIconMap: Record<string, LucideIcon> = {
  "Entertainment & Gossip": Sparkles,
  Communities: Users,
  Music: Music2,
  "Food & Cooking": UtensilsCrossed,
  "Tech & Innovation": Cpu,
  "Travel & Tourism": Plane,
  "Arts & Culture": Palette,
  "Adult & X-Rated": EyeOff,
  "Web3 & Finance": Coins,
  "Business & Money": Briefcase,
  "Sports & Fitness": Dumbbell,
  Politics: Landmark,
  "Podcasts & Newsletters": Mic,
  "Comedy & Skits": Laugh,
  "Lifestyle & Culture": Coffee,
  "Dating & Marriage": HeartHandshake,
  "News & Opinions": Newspaper,
  "Movie & Drama": Film,
  "Gaming & Esports": Gamepad2,
  "Fashion & Beauty": Shirt,
  "Health & Wellness": Heart,
  "Education & Learning": GraduationCap,
  Automotive: Car,
  "Real Estate & Property": Home,
  "Parenting & Family": Baby,
  "Pets & Animals": PawPrint,
  "DIY & Crafts": Hammer,
  "Photography & Videography": Camera,
  "Science & Nature": Microscope,
  "Books & Literature": BookOpen,
  "Religion & Spirituality": Church,
  "Charity & Social Cause": HandHeart,
};

const CategoryButton = ({
  category,
  selectedCategories,
  toggleCategory,
}: CategoryButtonProps) => {
  const Icon = categoryIconMap[category] || Sparkles;

  return (
    <Button
      key={category}
      type="button"
      variant={"outline"}
      data-selected={selectedCategories.includes(category) ? "true" : "false"}
      size="sm"
      onClick={() => toggleCategory(category)}
      className={cn(
        "text-xs flex-col items-start py-2 !border-border min-w-fit text-wrap h-full  hover:!border-foreground ",
        " data-[selected=true]:bg-error-300 data-[selected=true]:!border-primary data-[selected=true]:!text-background data-[selected=true]:ring ring-primary"
      )}
    >
      <div
        data-selected={selectedCategories.includes(category) ? "true" : "false"}
        className={cn(
          "size-6 rounded-full bg-secondary-200 grid place-items-center text-foreground",
          " data-[selected=true]:bg-primary "
        )}
      >
        <Icon className="size-3" />
      </div>
      <span className="text-wrap text-xs text-start">{category}</span>
    </Button>
  );
};

export default CategoryButton;
