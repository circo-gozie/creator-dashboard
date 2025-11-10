import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  className?: string;
}
const Spinner = ({ className = "" }: Props) => {
  return (
    <div
      className={cn(
        "size-7 relative animate animate-spin flex items-center justify-center",
        className
      )}
    >
      <Image src="/Spinner.svg" alt="loader" fill />
    </div>
  );
};

export default Spinner;
