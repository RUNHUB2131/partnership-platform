import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<SVGElement> {}

export function Loader({ className, ...props }: LoaderProps) {
  return <Loader2 className={cn("animate-spin", className)} {...props} />;
}