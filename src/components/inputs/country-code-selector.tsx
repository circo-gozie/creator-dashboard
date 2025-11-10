import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { countryCodes } from "@/lib/dummyData";
import { ChevronDown } from "lucide-react";
interface Props {
  code: string;
  setCode: (code: string) => void;
}

export function CountryCodeSelector({ code, setCode }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:!bg-transparent hover:!text-foreground"
        >
          {code}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {countryCodes.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => setCode(country.code)}
          >
            {country.code} - {country.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
