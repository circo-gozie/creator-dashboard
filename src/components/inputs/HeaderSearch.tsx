import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
const HeaderSearch = () => {
  return (
    <div className="w-96 items-center h-11 flex rounded-3xl overflow-hidden border">
      <Input
        className="border-0 placeholder:text-muted-foreground"
        placeholder="Search"
      />
      <div className="h-full w-14 bg-accent">
        <Button variant={"ghost"} className="h-full !rounded-0">
          <Search />
        </Button>
      </div>
    </div>
  );
};

export default HeaderSearch;
